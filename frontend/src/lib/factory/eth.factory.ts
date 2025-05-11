import { ethers, type Provider } from "ethers";
import { writable, type Writable } from "svelte/store";

const pimlico_key = import.meta.env.VITE_PIMLICO_KEY;

export const getPaymasterOptions = (chain: string) => {

    switch (chain) {

        // pimlico on gnosis requires extra token bundle @ 100 p.m. 

        case 'gnosis':
            return {
                paymasterAddress: "0x29b75b68551F2D2B3f298d327A20ac2289f0bb36",
                paymasterTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            }   
    }
 }
  
export const getBundlerUrl = (chain: string) => {

    switch (chain) {

        case 'gnosis':

            return `https://api.pimlico.io/v2/100/rpc?apikey=pim_B9EiWd9e25ykuWi1xFpA8n`;

        default:

            return `https://api.pimlico.io/v2/100/rpc?apikey=pim_B9EiWd9e25ykuWi1xFpA8n`;
    }
}

export const getRPC = (chain: string, alchemy_key: string) => {

    let rpc;

    switch (chain) {


        case 'gnosis':      
            rpc = `https://rpc.gnosis.gateway.fm`;
            break;

        default:
            rpc = `https://rpc.gnosis.gateway.fm`;
    }

    return rpc;
}

export const getProvider = (chain: string, alchemy_key: string) => {

    let provider;

    switch (chain) {

        case 'gnosis':

            provider = ethers.getDefaultProvider("https://rpc.gnosischain.com");
            break;

        default:
            
            provider = ethers.getDefaultProvider("https://rpc.gnosischain.com");
         
            break;
    }

    return provider;
}

export const addressFromKey = (privateKey: string) => {
    const wallet = new ethers.Wallet(privateKey);
    return wallet.address;
}

export const blockTime = async (block_number: string, provider: Provider) : Promise<string> =>  {

    const block = await provider.getBlock(block_number);
    if (block != null) {
        const blockTime = new Date(block.timestamp * 1000); 
        return blockTime.toLocaleDateString('nl') + " " + blockTime.toLocaleTimeString('nl'); //   toLocaleDateTimeString('nl')
    } else {
        return '-'
    }
}

export const getInternalTransactions = async (chain: string,txHash: string, token: string) : Promise<any[]> => {

    return new Promise( (resolve, reject) : any => {

        let url = `https://api.gnosisscan.io/api?module=account&action=txlistinternal&txhash=${txHash}&apikey=${token}`

        fetch(url)
            .then(response => response.json())  
            .then(response => {
                resolve(response.result)
            })
            .catch(err => console.error(err));

    });
}

export const isValidEthereumAddress = (address: string) => {
    // Check if the address is 42 characters long and starts with '0x'
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return false;
    }
    // Optional: Implement checksum validation (more complex)
    return true; // Return true if all checks pass
}


export const fixSafeAddress = (address: string) => {
    
    return ethers.getAddress(address);
}

export function fixAddressArray<T extends Iterable<any>>(store: Writable<T> | undefined): Writable<T> {
    if (store != undefined) {
        store.update((arr) => {
            console.log(arr)

            for (let a of arr) {
                if (typeof a == "string") {
                    a = fixSafeAddress(a)
                }
            }
            console.log(arr)
            return arr; 
        });
        return store; 
    } else {
        return writable<T>({} as T);
    }
}

export const hexToAddress = (hexString: string) => {
    
    if (hexString.length !== 66 || !hexString.startsWith("0x")) {
        throw new Error("Invalid hex string format");
    }
    const address = `0x${hexString.slice(-40)}`;
    if (!ethers.isAddress(address)) {
        throw new Error("Invalid Ethereum address");
    }

    return address;

}  

export const addressToUint256 = (address: string): string => {
    const addressHex = address.startsWith("0x") ? address.slice(2) : address;
    const paddedHex = addressHex.padStart(64, '0');
    return BigInt("0x" + paddedHex).toString();
}

export const uint256ToAddress = (uint256: string): string => {
    // Convert the uint256 string to hex, remove '0x' prefix if present
    let hex = BigInt(uint256).toString(16);
    // Pad to 40 characters (20 bytes) if needed
    hex = hex.padStart(40, '0');
    // Add '0x' prefix and ensure proper checksum
    return ethers.getAddress('0x' + hex);
}

export const expiryTimeHex = () => {

    const expiryTimeMs = Date.now() + 10 * 365 * 24 * 60 * 60 * 1000; 
    const expiryTimeSeconds = Math.floor(expiryTimeMs / 1000);
    return "0x" + expiryTimeSeconds.toString(16).padStart(64, '0');
}

export const expiredTimeHex = () => {
    const expiryTimeSeconds = 0;
    return "0x" + expiryTimeSeconds.toString(16).padStart(64, '0');
}
