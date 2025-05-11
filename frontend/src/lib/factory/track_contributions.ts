import { CirclesRpc } from '@circles-sdk/data';
import { CirclesData } from '@circles-sdk/data';
import { uint256ToAddress } from './eth.factory';

export interface GroupBalance {
    tokenId: string;
    balance: bigint;
}

export const getMyGroupTokenBalance = async ( safeAddress: string, groupAddress: string, contributionAmount: bigint) => {

    const circlesRpc = new CirclesRpc("https://static.94.138.251.148.clients.your-server.de/rpc/");
    const data_rpc = new CirclesData(circlesRpc);

    try {
        const balances = await data_rpc.getTokenBalances(safeAddress);
        const groupTokenBalance = balances.find((balance: any) => uint256ToAddress(balance.tokenId) === groupAddress);
        
        if (groupTokenBalance) {
            return {
                tokenId: groupTokenBalance?.tokenId,
                contributionCount: groupTokenBalance?.circles || 0n,
                contributedValue: groupTokenBalance?.circles ? BigInt(groupTokenBalance.circles) * BigInt(contributionAmount) : 0n
            };
        }

    } catch (error) {
        console.error('Failed to get group token balance:', error);
        throw error;
    }
};