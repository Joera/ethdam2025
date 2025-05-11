// import { writable } from 'svelte/store';
import { ethers, Wallet } from 'ethers';
import { localStorageStore } from './localstorage.store';

export const signer_key = localStorageStore('signer_key', "");

export const initPK = async () : Promise<void> => {

    const k = await hasKey();
    if (!k) {
        const key = _generatePK();
        if (signer_key) {
            signer_key.set(key); 
        }
    }
}

export const clearPK = async () : Promise<void> => {
    signer_key?.set(""); 
}

const _generatePK = () => {
    const w = ethers.Wallet.createRandom();
    return w.privateKey;
}

export const hasKey = (): Promise<string | boolean> => {
    return new Promise((resolve, reject) => {
        if (signer_key) {
            signer_key.subscribe((value: string) => {
                const b = value != "" ? value : false;
                resolve(b)
            });
        }
    })
}

