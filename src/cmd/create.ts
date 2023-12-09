import { Defender } from '@openzeppelin/defender-sdk';
import * as readline from 'readline/promises';

const { API_KEY, API_SECRET } = process.env;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const SUPPORTED_NETS = ['sepolia'];

export async function create() {
  const defender = new Defender({
    apiKey: API_KEY,
    apiSecret: API_SECRET,
  });

  // create a new relayer
  const name = await rl.question('Select Relayer name:');
  const network = await rl.question('Select Relayer network: [Sepolia]');
  if (!SUPPORTED_NETS.includes(network)) {
    throw new Error(`Network ${network} not supported, supported networks are: ${SUPPORTED_NETS.join(', ')}`);
  }

  console.log('Creating relayer...');
  const result = await defender.relay.create({
    name,
    network,
    minBalance: '0.05',
  });
  console.log(`Relayer created with address: ${result.address}`);

  // generate api keys
  console.log('Generating API keys...');
  const apiKeys = await defender.relay.createKey(result.relayerId);
  console.log(`API keys generated: ${JSON.stringify(apiKeys)}`);

  // log instructions
  console.log(
    `Relayer created successfully. Please add the following to your .env file:
    - RELAYER_ID=${result.relayerId}
    - RELAYER_API_KEY=${apiKeys.apiKey}
    - RELAYER_API_SECRET=${apiKeys.secretKey}

    Then fund your relayer and run the following command to initialize it:
    - yarn initialize
    `
  );

}