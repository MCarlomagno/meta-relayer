import { Defender } from '@openzeppelin/defender-sdk';
import { getDefaultProvider, formatEther, AbiCoder } from 'ethers';
import * as dotenv from "dotenv";

const metaRelayerArtifact = require('./contracts/artifact/MetaRelayer.json');

dotenv.config();
const { RELAYER_ID } = process.env;


const getBalance = async (address: string, network: string) => {
  const provider = getDefaultProvider('sepolia');
  const balance = await provider.getBalance(address);
  return balance;
}

export async function initialize() {
  const defender = new Defender({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  });

  if (!RELAYER_ID) {
    throw new Error('RELAYER_ID not found in .env file');
  }

  console.log('Loading Relayer...');
  const relayer = await defender.relay.get(RELAYER_ID);
  if (!relayer) {
    throw new Error(`Relayer with id ${RELAYER_ID} not found`);
  }

  console.log(`Loading balance for Relayer address: ${relayer.address}...`);
  const balance = await getBalance(relayer.address, relayer.network);
  console.log(`Relayer balance: ${formatEther(balance)} ETH`);
  if (formatEther(balance) <= '0.1') {
    throw new Error(`Relayer balance too low!`);
  }

  // console.log('Creating deployment config...');
  // const config = await defender.deploy.createConfig({
  //   relayerId: relayer.relayerId,
  // });

  // console.log('Loading approval process...');
  // const approvalProcess = await defender.deploy.getDeployApprovalProcess(relayer.network);
  // if (!approvalProcess) {
  //   throw new Error('No Defender approval process found for this network');
  // }


  console.log('Deploying contract...');
  const deployment = await defender.deploy.deployContract({
    contractName: 'MetaRelayer',
    contractPath: 'contracts/MetaRelayer.sol',
    network: relayer.network,
    constructorInputs: [relayer.address, '0'],
    artifactPayload: JSON.stringify(metaRelayerArtifact),
    verifySourceCode: false,
  });

  console.log(`Contract deployed at address: ${deployment.address} 
  
  Please add the following to your .env file:

  META_RELAYER_CONTRACT_ADDRESS=${deployment.address}

  You are all set! You can check a MetaRealyer example in sepolia:

  yarn run:increase-counter
  `);
}