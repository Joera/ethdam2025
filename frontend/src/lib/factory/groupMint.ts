import { Sdk } from '@circles-sdk/sdk';
import { SafeSdkBrowserContractRunner } from '@circles-sdk/adapter-safe';
import { AbiCoder } from 'ethers';

const groupMint = async (safeAddress: string, groupAddress: string, contributionAmount: bigint = BigInt(100)) => {

    // Initialize the adapter and SDK
    const adapter = new SafeSdkBrowserContractRunner();
    await adapter.init(safeAddress);

    const circlesConfig = {
        circlesRpcUrl: "https://static.94.138.251.148.clients.your-server.de/rpc/",
        v1HubAddress: "0x29b9a7fbb8995b2423a71cc17cf9810798f6c543",
        v2HubAddress: "0x3D61f0A272eC69d65F5CFF097212079aaFDe8267"
    };

    const sdk = new Sdk(adapter, circlesConfig); 
    const avatar = await sdk.getAvatar(safeAddress);
    // send one of your personal CRC to the group for authentication.
    const collateralAvatars = [safeAddress];
    const amounts = [BigInt(1)]; 

    // Encode the contribution amount as bytes and convert to Uint8Array
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(['uint256'], [contributionAmount]);
    // Remove '0x' prefix and convert to Uint8Array
    const data = new Uint8Array(Buffer.from(encodedData.slice(2), 'hex'));

    try {
        const receipt = await avatar.groupMint(groupAddress, collateralAvatars, amounts, data);
        console.log('Minting successful:', receipt);
    } catch (error) {
        console.error('Minting failed:', error);
    }
}