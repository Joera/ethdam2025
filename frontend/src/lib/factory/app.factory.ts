import { clearPK, hasKey, initPK } from "$lib/store/key.store";
import { addSafe, clearSafeStore, findSrvByChain, hasSafeAddresses, parseSafeAddress, safe_addresses, safe_store } from "$lib/store/safe.store";
import { ethers } from "ethers";
import { SafeService } from "../safe.service";
import { writable } from "svelte/store";


const fixOldSafeAddresses = (safe_array: string[]) => {
    
    if (safe_array.filter((safe) => safe.includes(':')).length < 1) {

        const addressZero = safe_array[0];
        safe_array = [];
        safe_array.push("gno:" + ethers.getAddress(addressZero));
    };

    safe_addresses?.set(safe_array);
    return safe_array;
}

export const initApp = async () => {

    const keyExists = await hasKey();
  
    if (typeof keyExists == "string" && keyExists) {
    
        console.log('init app')

        // somehow wont get addresses from factory
        let safe_array = ["0x169874fA8A472fB54aE31D500d57c0c7D5143815"]; 
        // await hasSafeAddresses();
        console.log("safe array", safe_array);
        safe_array = fixOldSafeAddresses(safe_array);
        console.log("safe array", safe_array);

        await Promise.all(safe_array.map(async (safe) => {

            const {chain, address} = parseSafeAddress(safe);
            const safeService = await SafeService.create(chain, keyExists, address);
            
            safe_store.update((safes) => { 
                safes[chain] = writable(safeService); 
                return safes; 
            });
        }));
    }
    
    console.log('finished init safe services')

}

export const initAppFromZero = async () => {
    
    await initPK();
    await Promise.all([
        addSafe("gnosis"), 
    ]);

    const srv = await findSrvByChain("gnosis");
    if (srv) {
        await srv.setDeployed(
            await srv.isDeployed()
        );
    }
}



export const clearApp = () => {
    
    localStorage.clear();
    clearSafeStore();
    clearPK();
}