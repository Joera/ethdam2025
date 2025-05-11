export const isTrustedByGroup = (groupAddress: string, candidate: string) => {

    const HUBv2_address = "0x68fD4a36DD4ee9766b48A1A484D0b1d7A0d77D05";

    const abi = [
        {
            "inputs":[
                {
                    "name":"_truster",
                    "type":"address"
                },
                {
                    "name":"_trustee",
                    "type":"address"
                }
            ],
            "name":"isTrusted",
            "outputs":[{
                "name":"",
                "type":"bool"
            }],
            "stateMutability":"view",
            "type":"function"
        }
    ]

    return [
        {
            conditionType: "evmContract",
            contractAddress: HUBv2_address,
            functionName: "isTrusted",
            functionParams: [groupAddress, candidate],
            functionAbi: abi,
            chain: "gnosis",
            returnValueTest: {
              key: "",
              comparator: "=",  
              value: "true",
            }
        }
    ]
}