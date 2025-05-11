import { type Writable } from 'svelte/store';


export const fromStore = async (writable: Writable<any>) : Promise<any>  => {
    return new Promise( (resolve, reject) => {
        writable.subscribe((value: any) => {
            resolve(value)
        });
    })
}