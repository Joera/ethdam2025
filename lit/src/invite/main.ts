import { isTrustedByGroup } from "./conditions";
import { evmWrite } from "./evm";


declare global {
    const Lit: any;
    const ethers: any;
    const pkpPublicKey: string;
    const safe_address: string;
    const group_address: string;
    const candidate: string;
}

const main = async () => {

    const t1 = new Date();


    try {

        const isAuthorized = await Lit.Actions.checkConditions({
            conditions: isTrustedByGroup(group_address, candidate),
            authSig: null,
            chain: 'gnosis',
        });

        if (isAuthorized == false) {
            throw new Error("Not authorized to publish");
        }

        const result = await evmWrite(pkpPublicKey, safe_address, safeAbi, 'execTransaction', [candidate]);
        console.log(result);

    }

    catch (e) {
        console.error(e);
    }

    const t2 = new Date();
    console.log(`Time taken: ${t2.getTime() - t1.getTime()} ms`);
}

main();