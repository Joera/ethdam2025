import type { SafeService } from "$lib/safe.service";
import { Safe4337Pack } from "@safe-global/relay-kit";
// import { SigningMethod } from '@safe-global/api-kit';
import SafeApiKit from '@safe-global/api-kit'
import { ethers, TransactionResponse } from "ethers";
import { getInternalTransactions } from "./eth.factory";
import { get } from "svelte/store";
const gnosisscan_key = import.meta.env.VITE_GNOSISSCAN_KEY;

export const tx = async (srv: SafeService, _transactions: any, includesDeploy: boolean) => {

    const apiKit = new SafeApiKit({
        chainId: 100n
    })
      

    console.log(srv, _transactions);
    const safeTransaction = await srv.legacy_kit?.createTransaction({ transactions: _transactions});
    if(safeTransaction === undefined) return;

    // const safeTxHash = await srv.legacy_kit?.getTransactionHash(safeTransaction);
    // if(safeTxHash === undefined) return;
    // const senderSignature = await srv.legacy_kit?.signHash(safeTxHash);
    // if(senderSignature === undefined) return;
    // safeTransaction.signatures = [senderSignature.data];
    const signedSafeTransaction = await srv.legacy_kit?.signTransaction(
        safeTransaction
    //    SigningMethod.ETH_SIGN
      )

    // await apiKit?.proposeTransaction({
    //     safeAddress: srv.safe_address,
    //     safeTransactionData: safeTransaction.data,
    //     safeTxHash,
    //     senderAddress: get(srv.signer_address),
    //     senderSignature: senderSignature.data
    //   })

    // const response = await apiKit.confirmTransaction(safeTxHash, senderSignature.data);

   // console.log('Transaction confirmed:', response);

    if (signedSafeTransaction) {

        try {
            // const st = await apiKit.getTransaction(safeTxHash)
            console.log(signedSafeTransaction);
            const executeTxResponse = await srv.legacy_kit?.executeTransaction(signedSafeTransaction);
            const receipt = await (executeTxResponse?.transactionResponse as TransactionResponse).wait()
            console.log('Transaction executed with:', receipt);
        } catch (error) {
            console.error('Transaction failed:', error);
        }
    }
}

export const tx4337 = async (srv: SafeService, transactions: any, includesDeploy: boolean, extraGas?: number) => { 

    if (srv.kit instanceof Safe4337Pack) {

        const safeOperation = await srv.kit.createTransaction({ transactions });

        const identifier = ethers.keccak256(ethers.toUtf8Bytes("plg_safe_tx"));

        safeOperation.data.callData = ethers.concat([
            safeOperation?.data.callData as `0x{string}`,
            identifier
        ]).toString()

        const identifiedSafeOperation = await srv.kit.getEstimateFee({
            safeOperation
        });

        if (extraGas) {
            identifiedSafeOperation.data.callGasLimit = identifiedSafeOperation.data.callGasLimit * BigInt(extraGas);
            identifiedSafeOperation.data.verificationGasLimit = identifiedSafeOperation.data.verificationGasLimit * BigInt(extraGas);
        }

        const signedSafeOperation = await srv.kit.signSafeOperation(identifiedSafeOperation)

        console.log("safeOperation", signedSafeOperation);

        const userOperationHash = await srv.kit.executeTransaction({
            executable: signedSafeOperation
        })

        let userOperationReceipt = null

        while (!userOperationReceipt) {
            // Wait 2 seconds before checking the status again
            await new Promise((resolve) => setTimeout(resolve, 2000))
            userOperationReceipt = await srv.kit.getUserOperationReceipt(
                userOperationHash
            )
        }

        const userOperationPayload = await srv.kit.getUserOperationByHash(
            userOperationHash
        );

        console.log("receipt",userOperationReceipt);
        console.log("txHash",userOperationPayload.transactionHash);

        srv.provider.waitForTransaction(userOperationPayload.transactionHash);

        const txs = await getInternalTransactions(srv.chain, userOperationPayload.transactionHash, gnosisscan_key);
        console.log(txs)

        // check for succes or failure and pass up ??? 

        if (includesDeploy) {
            const tx = txs.find( (tx) => tx.contractAddress != "");
            console.log(tx);
            return tx.contractAddress;
        } else {
            return "finished";
        }
    }

}