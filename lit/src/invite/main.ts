import { evmWrite } from "./evm";
// import SafeServiceClient from '@safe-global/safe-service-client';
// import { SafeTransactionDataPartial } from '@safe-global/protocol-kit';

declare global {
    const Lit: any;
    const ethers: any;
    const pkpPublicKey: string;
    const safe_address: string;
    const group_address: string;
    const candidate: string;
    
}

const main = async () => {

    const t1 = new Date();

    // const txServiceUrl = 'https://safe-transaction-gnosis-chain.safe.global';
    // const safeService = new SafeServiceClient({
    //     txServiceUrl,
    //     ethAdapter: new Web3Adapter(web3),
    // });

    try {

        const tokenInterface = new ethers.Interface(baseGroupAbi);
        const data = tokenInterface.encodeFunctionData(
            'trust',
            [candidate]
        );

        // sign 

    // create trust tx to be included in execute tx on safe!
        const trustTx : any[] = [
            // to: group_address,
            // value: 0,
            // data,
            // operation,
            // safeTxGas,
            // baseGas,
            // gasPrice,
            // gasToken,
            // refundReceiver,
            // signatures,
        ];

        const result = await evmWrite(pkpPublicKey, safe_address, safeAbi, 'execTransaction', trustTx, 1, false);
        console.log(result);

    }

    catch (e) {
        console.error(e);
    }

    const t2 = new Date();
    console.log(`Time taken: ${t2.getTime() - t1.getTime()} ms`);
}

main();