

const baseGroupAbi = [
    
    {
        "inputs": [
          {
            "internalType": "address",
            "name": "_trustReceiver",
            "type": "address"
          },
          {
            "internalType": "uint96",
            "name": "_expiry",
            "type": "uint96"
          }
        ],
        "name": "trust",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const safeAbi = [

    {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          },
          {
            "internalType": "uint8",
            "name": "operation",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "safeTxGas",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseGas",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "gasPrice",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "gasToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "refundReceiver",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "signatures",
            "type": "bytes"
          }
        ],
        "name": "execTransaction",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "payable",
        "type": "function"
      }
      
    
];
