"use strict";
(() => {
  // src/constants.ts
  var ALCHEMY_KEY = "DAfzjixY82ICdLCssh_dTQpoN0I2mthW";

  // src/invite/evm.ts
  var evmSetup = (contractAddress, publicationAbi) => {
    const provider = new ethers.providers.JsonRpcProvider({
      url: `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
      chainId: 84532,
      name: "Base Sepolia"
    });
    const contract = new ethers.Contract(contractAddress, publicationAbi, provider);
    return { provider, contract };
  };
  var evmWrite = async (pkpPublicKey2, contractAddress, publicationAbi, method, args, index, confirm = true) => {
    const { provider, contract } = evmSetup(contractAddress, publicationAbi);
    const ethAddress = ethers.utils.computeAddress(pkpPublicKey2);
    let nonce = await provider.getTransactionCount(ethAddress, "pending");
    const txData = contract.interface.encodeFunctionData(method, args);
    const feeData = await provider.getFeeData();
    const tx = {
      to: contractAddress,
      data: txData,
      nonce,
      gasLimit: ethers.utils.hexlify(1e5),
      maxFeePerGas: feeData.maxFeePerGas.mul(11).div(10),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || ethers.utils.parseUnits("1", "gwei"),
      chainId: 84532,
      value: 0,
      type: 2
    };
    const unsignedTx = ethers.utils.serializeTransaction(tx);
    const msgHash = ethers.utils.keccak256(unsignedTx);
    const signature = await Lit.Actions.signAndCombineEcdsa({
      toSign: ethers.utils.arrayify(msgHash),
      publicKey: pkpPublicKey2.replace("0x", ""),
      sigName: `signTx`
    });
    console.log("has signed");
    const s = JSON.parse(signature);
    const rFixed = "0x" + s.r.slice(-64);
    const sFixed = "0x" + s.s;
    const vFixed = Number(s.v);
    const serializedSignature = ethers.utils.joinSignature({
      r: rFixed,
      s: sFixed,
      v: vFixed
    });
    const serializedTx = ethers.utils.serializeTransaction(tx, serializedSignature);
    let result = await Lit.Actions.runOnce({
      waitForResponse: true,
      name: `evmTx`,
      jsParams: { serializedTx }
    }, async () => {
      try {
        const txResponse = await provider.sendTransaction(serializedTx);
        console.log(JSON.stringify(txResponse));
        console.log("Transaction sent! Hash:", txResponse.hash);
        return JSON.stringify({ hash: txResponse.hash });
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error("Error sending transaction:", errMsg);
        return JSON.stringify({ error: errMsg });
      }
    });
    return result;
  };

  // src/invite/main.ts
  var main = async () => {
    const t1 = /* @__PURE__ */ new Date();
    try {
      const tokenInterface = new ethers.Interface(baseGroupAbi);
      const data = tokenInterface.encodeFunctionData(
        "trust",
        [candidate]
      );
      const trustTx = [
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
      const result = await evmWrite(pkpPublicKey, safe_address, safeAbi, "execTransaction", trustTx, 1, false);
      console.log(result);
    } catch (e) {
      console.error(e);
    }
    const t2 = /* @__PURE__ */ new Date();
    console.log(`Time taken: ${t2.getTime() - t1.getTime()} ms`);
  };
  main();
})();
