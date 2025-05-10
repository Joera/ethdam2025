import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_ABILITY, LIT_NETWORK, LIT_RPC } from "@lit-protocol/constants";
import * as ethers from "ethers";
import * as path from 'path';
import * as fs from 'fs/promises';
import 'dotenv/config';
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { LitPKPResource, LitActionResource, createSiweMessageWithRecaps, generateAuthSig } from "@lit-protocol/auth-helpers";

const epk = process.env.ETHEREUM_PRIVATE_KEY || "";
const SELECTED_LIT_NETWORK = LIT_NETWORK.Datil;

const main = async () => {

    if (!process.env.ETHEREUM_PRIVATE_KEY) {
        throw new Error('ETHEREUM_PRIVATE_KEY environment variable is not set');
    }

   //  Read the action code
    const inviteActionCode = await fs.readFile(
        path.join(process.cwd(), 'dist/invite', 'main.js'),
        'utf-8'
    );


    const litNodeClient = new LitNodeClient({
        litNetwork: SELECTED_LIT_NETWORK,
        debug: false
    });

    await litNodeClient.connect();
    const ethersWallet = new ethers.Wallet(
        epk,
        new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
    );

    let capacityTokenId: string = "";
    if (!process.env.CAPACITY_TOKEN_ID) {

        const litContracts = new LitContracts({
            signer: ethersWallet,
            network: SELECTED_LIT_NETWORK,
        });
        await litContracts.connect();

        capacityTokenId = (
            await litContracts.mintCapacityCreditsNFT({
            requestsPerKilosecond: 10,
            daysUntilUTCMidnightExpiration: 1,
            })
        ).capacityTokenIdStr;

        console.log("Capacity token ID:", capacityTokenId);

    } else {
        capacityTokenId = process.env.CAPACITY_TOKEN_ID!;
    }

    const { capacityDelegationAuthSig } =
      await litNodeClient.createCapacityDelegationAuthSig({
        dAppOwnerWallet: ethersWallet,
        capacityTokenId,
        delegateeAddresses: [ethersWallet.address],
        uses: "1",
      });

    const sessionSignatures = await litNodeClient.getSessionSigs({    
        chain: "yellowstone",
        capabilityAuthSigs: [capacityDelegationAuthSig],
        expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
        resourceAbilityRequests: [
          {
            resource: new LitPKPResource("*"),
            ability: LIT_ABILITY.PKPSigning,
          },
          {
            resource: new LitActionResource("*"),
            ability: LIT_ABILITY.LitActionExecution,
          },
        ],
        authNeededCallback: async ({
          resourceAbilityRequests,
          expiration,
          uri,
        }) => {
          const toSign = await createSiweMessageWithRecaps({
            uri: uri!,
            expiration: expiration!,
            resources: resourceAbilityRequests!,
            walletAddress: ethersWallet.address,
            nonce: await litNodeClient.getLatestBlockhash(),
            litNodeClient,
          });

          return await generateAuthSig({
            signer: ethersWallet,
            toSign,
          });
        },
    });

    let startTime = Date.now();

    try {

      const pkpPublicKey = "";

      const action1: any = await litNodeClient.executeJs({
          sessionSigs: sessionSignatures,
          code: inviteActionCode,
          ///ipfsId: protocolInfo.lit_action,
          jsParams: { 
            pkpPublicKey,
            group_address,
            safe_address,
            candidate
          } 
      });

      let endTime = Date.now();
      console.log("executed action 1: ", ((endTime - startTime) / 1000).toFixed(3), "seconds");

      console.log(action1.logs);

    } catch (error) {   
      console.error("Error deploying action:", error);
    }

  console.log("signer", ethersWallet.address)

  //  console.log("Ethers wallet:", await ethersWallet.getAddress());
    // console.log(sessionSignatures)
    //console.log(response);

}

main();