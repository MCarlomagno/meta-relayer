import { Defender } from '@openzeppelin/defender-sdk';

const { RELAYER_ID } = process.env;

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

  console.log('Loading approval process...');
  const approvalProcess = await defender.deploy.getDeployApprovalProcess(relayer.network);
  if (!approvalProcess) {
    throw new Error('No Defender approval process found for this network');
  }

  console.log('Deploying contract...');
  const deployment = await defender.deploy.deployContract({
    contractName: 'MetaRelayer',
    contractPath: 'contracts/MetaRelayer.sol',
    network: relayer.network,
    constructorInputs: [`[${relayer.address}]`, '0'],
    artifactPayload: 'contracts/MetaRelayer.json',
    verifySourceCode: false,
  });

  console.log(`Contract deployed at address: ${deployment.address} 
  Please add the following to your .env file:
  - META_RELAYER_ADDRESS=${deployment.address}
  `);
}