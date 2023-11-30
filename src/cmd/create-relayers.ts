import { Defender } from "@openzeppelin/defender-sdk";
import * as dotenv from "dotenv";

dotenv.config();

type RelayerApiKey = ReturnType<Defender["relay"]["createKey"]>;

export async function createRelayers() {
  const defennder = new Defender({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  });

  const relayerNames = ["relayer1", "relayer2", "relayer3", "relayer4"];
  const network = "goerli";

  // create relayers
  const relayersWithApiKeys = await Promise.all(
    relayerNames.map((name) => createRelayer(defennder, name, network)),
  );

  console.log("Relayers created", relayersWithApiKeys);
}

async function createRelayer(
  client: Defender,
  name: string,
  network: string,
): Promise<RelayerApiKey> {
  return client.relay
    .create({
      network,
      minBalance: "0",
      name,
    })
    .then((r) => client.relay.createKey(r.relayerId));
}
