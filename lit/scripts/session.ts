import { LitActionResource, LitPKPResource, createSiweMessage, createSiweMessageWithRecaps, generateAuthSig } from "@lit-protocol/auth-helpers";
import { LIT_ABILITY } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { ethers, Wallet } from "ethers"; // Ethers v6

// export const createSessionSignatures = async (client: LitNodeClient, signer: Wallet, capacityTokenId: string) => {

//     const resourceAbilityRequests : any = [
//         {
//             resource: new LitActionResource("*"),
//             ability: LIT_ABILITY.LitActionExecution,
//         },
//         {
//             resource: new LitPKPResource("*"),
//             ability: LIT_ABILITY.PKPSigning,
//         }
//     ];


//     const { capacityDelegationAuthSig } =
//       await client.createCapacityDelegationAuthSig({
//         dAppOwnerWallet: signer,
//         capacityTokenId,
//         delegateeAddresses: [signer.address],
//         uses: "1",
//       });

//     const sigs = await client.getSessionSigs({
//         chain: "yellowstone",
//         capabilityAuthSigs: [capacityDelegationAuthSig],
//         expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
//         resourceAbilityRequests,
//         authNeededCallback: async ({
//             uri,
//             expiration,
//             resourceAbilityRequests,
//         }) => {
//         const toSign = await createSiweMessage({
//             uri,
//             expiration,
//             resources: resourceAbilityRequests,
//             walletAddress: await signer.getAddress(),
//             nonce: await client.getLatestBlockhash(),
//             litNodeClient: client,
//         });
        
    
//         return await generateAuthSig({
//             signer: signer,
//             toSign,
//         });
//         },
//     });

//     return sigs;
// }

export const createSessionSignatures = async (litNodeClient: LitNodeClient, ethersWallet: ethers.Wallet, capacityTokenId: string) => {

        const { capacityDelegationAuthSig } = await litNodeClient.createCapacityDelegationAuthSig({
            dAppOwnerWallet: ethersWallet,
            capacityTokenId,
            delegateeAddresses: [ethersWallet.address],
            uses: "1",
        });

        console.log("✅ Capacity Delegation Auth Sig created");
        console.log("🔄 Attempting to execute the Lit Action code...");

        return await litNodeClient.getSessionSigs({ 

            chain: "yellowstone",
            capabilityAuthSigs: [capacityDelegationAuthSig],
            expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
            resourceAbilityRequests: [
            {
                resource: new LitPKPResource("*"),
                ability: LIT_ABILITY.PKPSigning,
            },
            {
                resource: new LitActionResource("*"),
                ability: LIT_ABILITY.LitActionExecution,
            },
            ],
            authNeededCallback: async ({
                resourceAbilityRequests,
                expiration,
                uri,
            }) => {
                const toSign = await createSiweMessageWithRecaps({
                uri: uri!,
                expiration: expiration!,
                resources: resourceAbilityRequests!,
                walletAddress: ethersWallet.address,
                nonce: await litNodeClient.getLatestBlockhash(),
                litNodeClient,
                });

                return await generateAuthSig({
                    signer: ethersWallet,
                    toSign,
                });
            },
        });
};