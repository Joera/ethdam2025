

const evmSetup = (contractAddress: string, publicationAbi: any) => {

    const provider = new ethers.providers.JsonRpcProvider({
        url: `https://rpc.gnosischain.com`,
        chainId: 100,
        name: "Gnosis"
    });
    
    const contract = new ethers.Contract(contractAddress, publicationAbi, provider);

    return { provider,contract };
    
}

export const evmWrite = async (
    pkpPublicKey: string, 
    contractAddress: string, 
    publicationAbi: any,
    method: string,
    args: any[],

) => {
   
    const { provider, contract } = evmSetup(contractAddress, publicationAbi);
    const ethAddress = ethers.utils.computeAddress(pkpPublicKey);  
    // const balance = await provider.getBalance(ethAddress);
    // console.log('Account balance:', ethAddress, ethers.utils.formatEther(balance), 'ETH');  
    let nonce = await provider.getTransactionCount(ethAddress, "pending");
    const txData = contract.interface.encodeFunctionData(method, args);
    // const gasPrice = await provider.getGasPrice();
    // const adjustedGasPrice = gasPrice.mul(11).div(10);

    const feeData = await provider.getFeeData();

    const tx = {
        to: contractAddress,
        data: txData,
        nonce,
        gasLimit: ethers.utils.hexlify(100_000),
        maxFeePerGas: feeData.maxFeePerGas.mul(11).div(10),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || ethers.utils.parseUnits('1', 'gwei'),
        chainId: 84532,
        value: 0,
        type: 2
    };
    
    const unsignedTx = ethers.utils.serializeTransaction(tx);
    const msgHash = ethers.utils.keccak256(unsignedTx);

    const signature = await Lit.Actions.signAndCombineEcdsa({

        toSign: ethers.utils.arrayify(msgHash),
        publicKey: pkpPublicKey.replace("0x", ""),
        sigName: `signTx`
    });

    console.log("has signed");
    
    const s = JSON.parse(signature);

    const rFixed = '0x' + s.r.slice(-64); // Take last 64 characters
    const sFixed = '0x' + s.s;
    const vFixed = Number(s.v);

    const serializedSignature = ethers.utils.joinSignature({
        r: rFixed,
        s: sFixed,
        v: vFixed
    });
    
    const serializedTx = ethers.utils.serializeTransaction(tx, serializedSignature);
    // console.log('Serialized transaction:', serializedTx);

    let result = await Lit.Actions.runOnce({
        waitForResponse: true,
        name: `evmTx`,
        jsParams: {serializedTx}
    }, async () => {
        try {
            const txResponse = await provider.sendTransaction(serializedTx);
            console.log(JSON.stringify(txResponse));
            console.log('Transaction sent! Hash:', txResponse.hash);
            // if (confirm) {
            //     const receipt = await provider.waitForTransaction(txResponse.hash);
            //     console.log('Transaction confirmed in block:', receipt.blockNumber);
            // }
            return JSON.stringify({ hash: txResponse.hash });
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.error('Error sending transaction:', errMsg);
            return JSON.stringify({ error: errMsg });
        }
    });

    return result;

};

export const evmRead = async (
    contractAddress: string, 
    publicationAbi: any, 
    method: string, 
    args: any[]
) => {

    const { provider, contract } = evmSetup(contractAddress, publicationAbi);
    return await contract[method](...args);

}
