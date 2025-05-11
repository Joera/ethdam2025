import { ethers as ethers5 } from "ethers5";
import { ethers } from "hardhat";
import { providers, Wallet, BigNumber, Overrides } from "ethers5";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { AUTH_METHOD_SCOPE, AUTH_METHOD_TYPE, LIT_ABILITY, LIT_AUTH_SIG_CHAIN_KEYS, LIT_NETWORK, LIT_RPC, LitAbility } from "@lit-protocol/constants";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { getAuthIdByAuthMethod } from '@lit-protocol/lit-auth-client';
import ipfsOnlyHash from "typestub-ipfs-only-hash";

import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';


import { LitActionResource, LitPKPResource, createSiweMessage, generateAuthSig } from "@lit-protocol/auth-helpers";
import dotenv from "dotenv";
import Safe from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { OperationType } from "@safe-global/safe-core-sdk-types";

dotenv.config();

const INVITE_ACTION_HASH = process.env.INVITE_ACTION_HASH!;

async function main() {
    
    const provider = new providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE);
    const signer = new Wallet(process.env.PRIVATE_KEY!, provider);

    const client = new LitNodeClient({
        litNetwork: LIT_NETWORK.Datil
    });
    await client.connect();

       const litContracts = new LitContracts({
        network: LIT_NETWORK.Datil,
        signer: signer
    });

    await litContracts.connect();

    const inviteActionCid = await uploadToPinata("../lit/dist/invite/main.js");

    console.log("Invite Action CID:", inviteActionCid);

    const pkpInfo = await mintPkpWithLitActionAuthMethod(litContracts, inviteActionCid.IpfsHash)

    console.log("PKP ID:", pkpInfo.tokenId);
    console.log("PKP Public Key:", pkpInfo.publicKey);
    console.log("PKP Eth Address:", pkpInfo.ethAddress);

    // Check PKP ownership
    const owner = await litContracts.pkpNftContract.read.ownerOf(pkpInfo.tokenId);
    console.log("PKP Owner:", owner);
    console.log("Signer address:", await signer.getAddress());
    if (owner.toLowerCase() !== (await signer.getAddress()).toLowerCase()) {
        throw new Error("PKP ownership verification failed - owner does not match signer");
    }
    console.log("✅ PKP successfully minted and owned by signer!");

    // Log final permissions
    const permittedAuthMethods = await litContracts.pkpPermissionsContract.read.getPermittedAuthMethods(pkpInfo.tokenId);
    console.log("\nPermitted Auth Methods:");
    permittedAuthMethods.forEach((method, i) => {
        console.log(`\nAuth Method ${i + 1}:`);
        console.log("- Type:", method.authMethodType);
        console.log("- ID:", method.id || "Any ETH address");
        console.log("- User PubKey:", method.userPubkey);
    });

    const permittedActions = await litContracts.pkpPermissionsContract.read.getPermittedActions(pkpInfo.tokenId);
    console.log("\nPermitted Actions:", permittedActions);
    console.log("\nNOTE: Access control will be handled by Lit Action conditions");
    console.log(`🔄 Checking PKP balance...`, pkpInfo.ethAddress);
    let bal = await provider.getBalance(pkpInfo.ethAddress!);
    let formattedBal = ethers5.utils.formatEther(bal);

    if (Number(formattedBal) < Number(ethers5.utils.formatEther(25_000))) {
      console.log(
        `ℹ️  PKP balance: ${formattedBal} is insufficient to run example`
      );
      console.log(`🔄 Funding PKP...`);

      const fundingTx = {
        to: pkpInfo.ethAddress!,
        value: ethers5.utils.parseEther("0.001"),
        gasLimit: 21_000,
        gasPrice: (await signer.getGasPrice()).toHexString(),
        nonce: await provider.getTransactionCount(signer.address),
        chainId: provider.network.chainId,
      };

      const tx = await signer.sendTransaction(fundingTx);
      await tx.wait();
      console.log(`✅ Funded PKP on Chronicle Yellowstone with 0.001 tokens`);

      // Fund on Base Sepolia
      console.log(`🔄 Funding PKP on Gnosis...`);
      const gnosisProvider = new providers.JsonRpcProvider('https://rpc.gnosischain.com');
      const gnosisSigner = new Wallet(process.env.PRIVATE_KEY!, gnosisProvider);

      const gnosisFundingTx = {
        to: pkpInfo.ethAddress!,
        value: ethers5.utils.parseEther("0.001"),
        gasLimit: 21_000,
        gasPrice: (await gnosisSigner.getGasPrice()).toHexString(),
        nonce: await gnosisProvider.getTransactionCount(gnosisSigner.address),
        chainId: gnosisProvider.network.chainId
      };

      const gnosisTx = await gnosisSigner.sendTransaction(gnosisFundingTx);
      await gnosisTx.wait();
      console.log(`✅ Funded PKP on Gnosis with 0.001 ETH`);
      
    } else {
      console.log(`✅ PKP has a sufficient balance of: ${formattedBal}`);
    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

const getPkpInfoFromMintTxReceipt = async ({
    txReceipt,
    litContractsClient,
}: {
    txReceipt: ethers5.ContractReceipt,
    litContractsClient: LitContracts
}) => {
    if (!txReceipt.events) {
        throw new Error('No events found in transaction receipt');
    }

    const pkpMintedEvent = txReceipt.events.find(
        (event: any) =>
            event.topics[0] ===
            "0x3b2cc0657d0387a736293d66389f78e4c8025e413c7a1ee67b7707d4418c46b8"
    );

    if (!pkpMintedEvent?.data) {
        throw new Error('PKP minted event data not found');
    }

    const publicKey = '0x' + pkpMintedEvent.data.slice(130, 260);
    const tokenId = ethers5.utils.keccak256(publicKey);
    const ethAddress = await litContractsClient.pkpNftContract.read.getEthAddress(
        tokenId
    );

    return {
        tokenId: ethers5.BigNumber.from(tokenId).toString(),
        publicKey,
        ethAddress,
    };
};

const mintPkpWithLitActionAuthMethod = async (
    litContracts: LitContracts,
    inviteActionCid: string,
  ) => {
  
    const mintTx = await litContracts.pkpHelperContract.write.mintNextAndAddAuthMethods(
      AUTH_METHOD_TYPE.LitAction, // keyType
      [AUTH_METHOD_TYPE.LitAction], // permittedAuthMethodTypes
      [
        convertIpfsCid({ cid: inviteActionCid, outputFormat: "hex" })
      ], 
      ["0x"], // permittedAuthMethodPubkeys
      [[AUTH_METHOD_SCOPE.SignAnything]], // permittedAuthMethodScopes
      false, // addPkpEthAddressAsPermittedAddress
      false, // sendPkpToItself
      { value: await litContracts.pkpNftContract.read.mintCost() }
    )
    const mintTxReceipt = await mintTx.wait();
  
    return getPkpInfoFromMintTxReceipt({
      txReceipt: mintTxReceipt,
      litContractsClient: litContracts,
    });
}

export async function getLitActionIpfsCid({
    input,
    outputFormat
}: {
    input: string,
    outputFormat: "base58" | "hex"
}): Promise<string> {
    const base58Cid = await ipfsOnlyHash.of(input);
    if (outputFormat === "base58") {
        return base58Cid;
    } else {
        return `0x${Buffer.from(
            ethers5.utils.base58.decode(
                base58Cid
            )
        ).toString("hex")}`
    }
}

export function convertIpfsCid({
  cid,
  outputFormat
}: {
  cid: string,
  outputFormat: "base58" | "hex"
}): string {
  if (outputFormat === "base58") {
      return cid;
  } else {
      return `0x${Buffer.from(
          ethers5.utils.base58.decode(
              cid
          )
      ).toString("hex")}`
  }
}

async function uploadToPinata(filePath: string) {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    try {
        const response = await axios.post(url, formData, {
            maxBodyLength: Infinity,
            headers: {
                ...formData.getHeaders(),
                'pinata_api_key': process.env.PINATA_API_KEY!.trim(),
                'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY!.trim()
            }
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error('Error response:', {
                status: error.response.status,
                data: error.response.data
            });
        }
        throw error;
    }
}

// // Get the file path from command line arguments
// const filePath = process.argv[2];
// if (!filePath) {
//     console.error('Please provide a file path');
//     process.exit(1);
// }
