import { ethers } from 'ethers';

// Set up provider and signer
const provider = new ethers.JsonRpcProvider('https://rpc.gnosischain.com');
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const EURe_ADDRESS = '0xcB444e90D8198415266c6a2724b7900fb12FC56E';     
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)'
];

const MINT_POLICY_ADDRESS = "0x";
export const approveStablecoinTransfer = async (userAddress: string, contributionAmount: number) => {
  const usdc = new ethers.Contract(EURe_ADDRESS, ERC20_ABI, signer);
  // authorize monethly payments for duration of a year
  const allowance = ethers.parseUnits((12 * contributionAmount).toString(), 6); 
  const tx = await usdc.approve(MINT_POLICY_ADDRESS, allowance);
  console.log('Transaction hash:', tx.hash);
  await tx.wait();
  console.log('Approval confirmed');
}


