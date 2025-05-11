export const ssr = false;
export const prerender = false;

import { get, writable, type Writable } from 'svelte/store';
import Safe from "@safe-global/protocol-kit";
import { Safe4337Pack } from "@safe-global/relay-kit";
import { type Signer, type Provider, type Contract, ethers } from "ethers";
import { getRPC, getProvider, isValidEthereumAddress, fixSafeAddress, getBundlerUrl, getPaymasterOptions } from "./factory/eth.factory";
import { fromStore } from './factory/store.factory';
import { addSafeAddress, formatSafeAddress } from './store/safe.store';
import { tx, tx4337 } from './factory/aa.factory';

// https://docs.safe.global/advanced/smart-account-supported-networks?service=Transaction+Service&version=v1.4.1&search=100&expand=100
const eip4337ModuleAddress = "0xa581c4A4DB7175302464fF3C06380BC3270b4037" // v3: "0x75cf11467937ce3F2f357CE24ffc3DBF8fD5c226";
const migrationModuleAddress = "0x526643F69b81B008F46d95CD5ced5eC0edFFDaC6";
const welcomeNFTAddress = "0xe151Bf8B3D209cc84F0bdf7d13FD7Ebfe9beb6f4";

export interface ISafeService {

    chain: string;
    safe_address: string;
    signer_key: string;
    signer?: Signer;
    signer_address?: Writable<string>;
    signers: Writable<string[]>;
    kit?: Safe4337Pack | Safe;
    provider: Provider;
    version: Writable<string>;
    deployed: Writable<boolean>;
    modules: Writable<string[]>;
    isDeployed(safe_address: string) : Promise<boolean>;
    genericRead: (address: string, abi: string, method: string, args: string[]) => Promise<any>;
    genericTx(address: string, abi: any, method: string, args: any[], includesDeploy: boolean) : Promise<string>;
    genericCall(contract_address: string, abi: any, method: string, args: any[]) : Promise<string>;
  //  getContacts: () => Promise<any>;
}

const alchemy_key = import.meta.env.VITE_ALCHEMY_KEY;
const pimlico_key = import.meta.env.VITE_PIMLICO_KEY;


export class SafeService implements ISafeService {

    // avatar?: any;
    chain!: string;
    safe_address: string = "";
    signer_key: string = "";
    
    signer_address: Writable<string> = writable("");
    signers: Writable<string[]> = writable([]);
    version: Writable<string> = writable("");
    deployed: Writable<boolean> = writable(false);
    modules: Writable<string[]> = writable([]);

    provider!: Provider;

    signer?: Signer;
    kit?: Safe4337Pack;
    legacy_kit?: Safe;

    private constructor() {}

    getDeployed() {
        return get(this.deployed); // Access the current value of the store
    }
    
    setDeployed(b: boolean) {
        this.deployed.set(b); // Update the store's value
    }

    static async create(chain: string, signer_key: string, safe_address: string) {

        chain = (chain == "gno" || chain == "crc") ? "gnosis" : chain;
        console.log('start creating srv for ', chain, safe_address);
        const instance = new SafeService();
        await instance.initialize(chain, signer_key, safe_address);
        if (instance.provider == undefined) return instance;
        await instance.setup();
            
        console.log('finished creating srv for ', instance.chain, instance.safe_address);

        return instance;
    }

    private async initialize(chain: string, signer_key: string, safe_address: string) {

        this.chain = chain
        this.signer_key = signer_key;
        this.safe_address = safe_address;

        try {
            this.provider = getProvider(chain, alchemy_key);
        } catch (error) {
            console.log("provider error", this.chain,error);
        }

        if (this.provider == undefined) return;

        let signer = new ethers.Wallet(signer_key, this.provider);
        this.signer = signer.connect(this.provider);
        this.signer_address = writable(signer.address);
    
    }
   
    async setup () {



        await this.initSafe();

        console.log(this.legacy_kit);
        console.log(this.safe_address);
        // contracts created from aboutcircles are 1.3.0 and miss the The EIP-4337 module
        // this.safe_address = fixSafeAddress(await this.initSafeWithRelay() || "");
        addSafeAddress(formatSafeAddress(this.chain, this.safe_address));
        
      
            //  this.getBalances()
  

        
    }

    async initSafe() {

        if (isValidEthereumAddress(this.safe_address) && this.getDeployed()) {

            this.legacy_kit = await Safe.init({
                provider: getRPC(this.chain, alchemy_key),
                signer : this.signer_key,
                safeAddress : this.safe_address
            });
        }
    }

    async nativeTx (to_address: string, value: string) : Promise<string> {

        return new Promise( async (resolve, reject) => {
    
            const transaction1 = { 
                to: to_address,
                data: "0x",
                value
            }
    
            const transactions = [transaction1];

            if (this.kit instanceof Safe4337Pack) {
                const r = await tx4337(this,transactions, false);
                resolve(r);

            } else {       
                const r = await tx(this,transactions, false);
                resolve("ok");
            }  
        });
    }

    async genericTx (contract_address: string, abi: any, method: string, args: any[], includesDeploy: boolean, extraGas?: number, legacy: boolean = false) : Promise<string> {

        return new Promise( async (resolve, reject) => {
    
            const contract = new ethers.Contract(contract_address, abi, this.signer);
            const txData = contract.interface.encodeFunctionData(method, args);
    
            const transaction1 = { 
                to: contract_address,
                data: txData,
                value: "0"
            }
    
            const transactions = [transaction1];

            if (this.kit instanceof Safe4337Pack && !legacy) {
                const r = await tx4337(this,transactions, includesDeploy, extraGas);
                resolve(r);

            } else {       
                console.log("legacy txs", transactions);
                const r = await tx(this,transactions, includesDeploy);
                resolve("ok");
            }  
        });
    }

    async genericCall(contract_address: string, abi: any, method: string, args: any[]) : Promise<string> {

        const contract = new ethers.Contract(contract_address, abi, this.provider);
        const response = await contract[method](...args);
        return response.toString();
    }

    async genericRead(address: string, abi: any, method: string, args: any[]) : Promise<any> {

        const contract = new ethers.Contract(address, abi, this.signer);
        return await contract[method](...args);
    }

    async isDeployed() : Promise<boolean> {

        // console.log("safe address", this.safe_address);

        if (this.safe_address != "0x") {
            const code = await this.provider.getCode(this.safe_address);
            return (code !== '0x') ? true : false;
        } else {
            return false
        }
    }


    // async getBalances() : Promise<void> {

    //     for (let token of JSON.parse(JSON.stringify(tokenList[this.chain]))) {

    //         try {

    //             if (token.symbol === "xDAI") {
    //                 token.balance = await this.getNativeBalance(this.safe_address); 
    //             } else {
    //                 token.balance = await this.getBalance(token.address);
    //             }
                
    //             this.tokens.update((tokens) => {
    //                 tokens.set(token.address, token);
    //                 return tokens;
    //             });

    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }
    //     // console.log(this.safe_address, this.tokens);
       
    // }

    async getNativeBalance(address: string) : Promise<string> { 

        const balance = await this.provider.getBalance(address);
        return ethers.formatUnits(balance, 18);
    }


    async getBalance(token_address: string) : Promise<string> {

        const erc20Abi = [
            "function balanceOf(address owner) view returns (uint256)"
        ];
        const tokenContract = new ethers.Contract(token_address, erc20Abi, this.provider);
        const balance = await tokenContract.balanceOf(this.safe_address);
        return ethers.formatUnits(balance, 18);
    }

    async createGroup(name: string, symbol: string) {

        console.log("reached group");

        const factory_abi = [{"inputs":[],"name":"MaxNameLength19","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"group","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"mintHandler","type":"address"},{"indexed":false,"internalType":"address","name":"treasury","type":"address"}],"name":"BaseGroupCreated","type":"event"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_service","type":"address"},{"internalType":"address","name":"_feeCollection","type":"address"},{"internalType":"address","name":"_customMintPolicy","type":"address"},{"internalType":"address[]","name":"_initialConditions","type":"address[]"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"bytes32","name":"_metadataDigest","type":"bytes32"}],"name":"createTrustFund","outputs":[{"internalType":"address","name":"group","type":"address"},{"internalType":"address","name":"mintHandler","type":"address"},{"internalType":"address","name":"treasury","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"group","type":"address"}],"name":"deployedByFactory","outputs":[{"internalType":"bool","name":"deployed","type":"bool"}],"stateMutability":"view","type":"function"}];

        const trustFundFactory = '0x68fD4a36DD4ee9766b48A1A484D0b1d7A0d77D05';
        const customMintPolicy = "xxx";

        const owner = "0xf5CDb3Ae546E66da2Df9203Fb1E2D5F0C94f4893";
        const service = "0xf5CDb3Ae546E66da2Df9203Fb1E2D5F0C94f4893";
        const feeCollection = "0xf5CDb3Ae546E66da2Df9203Fb1E2D5F0C94f4893";
        
        const initialConditions: any[] = [];
      
        const args : any[] = [
            owner, 
            service, 
            feeCollection, 
            customMintPolicy, 
            initialConditions, 
            name, 
            symbol
        ];

        const r = await this.genericTx(trustFundFactory, factory_abi, "createTrustFund", [args], false);

    }

}