export const ssr = false;
export const prerender = false;

import { initAppFromZero } from '$lib/factory/app.factory';
import { initApp } from '$lib/factory/app.factory';
import { hasKey, signer_key } from '$lib/store/key.store';
// import { hasSafeAddresses } from '$lib/store/safe.store';


/** @type {import('./$types').PageLoad} */


export const load = async () => {

    if(await hasKey()) {

        initApp();

    } else { 
        
        initAppFromZero();
    } 
}   


