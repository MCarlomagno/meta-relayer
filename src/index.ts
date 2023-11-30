import { MetaRelayer } from "./meta-relayer";
import { Relayer } from "@openzeppelin/defender-sdk-relay-signer-client";

type RelayerKeys = {
  apiKey: string;
  apiSecret: string;
};

const RELAYER_KEYS: RelayerKeys[] = [{
  apiKey: process.env.RELAYER1_API_KEY,
  apiSecret: process.env.RELAYER1_API_SECRET,
}, 
{
  apiKey: process.env.RELAYER2_API_KEY,
  apiSecret: process.env.RELAYER2_API_SECRET,
},
{
  apiKey: process.env.RELAYER3_API_KEY,
  apiSecret: process.env.RELAYER3_API_SECRET,
},
{
  apiKey: process.env.RELAYER4_API_KEY,
  apiSecret: process.env.RELAYER4_API_SECRET,
}];

function createRelayerClient(relayerKeys: RelayerKeys) {
  if (relayerKeys.apiKey === undefined || relayerKeys.apiSecret === undefined) {
    throw new Error('Relayer keys not found');
  }
  return new Relayer({
    apiKey: relayerKeys.apiKey,
    apiSecret: relayerKeys.apiSecret,
  });
}

export function getSingleRelayerClient() {
  const client = createRelayerClient(RELAYER_KEYS[1]);
  return client;
}

export function getMetarelayerClient() {
  const clients = RELAYER_KEYS.map(createRelayerClient);
  return new MetaRelayer(clients);
}
