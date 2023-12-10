
import { MetaRelayer } from "../meta-relayer";
import { Relayer } from "@openzeppelin/defender-sdk-relay-signer-client";

const CounterAbi = require("./contracts/Counter.json");

const { RELAYER_API_KEY, RELAYER_API_SECRET } = process.env;

async function main() {
  const singleRelayer = new Relayer({
    apiKey: RELAYER_API_KEY,
    apiSecret: RELAYER_API_SECRET,
  });
  const metaRelayer = new MetaRelayer([singleRelayer]);

  // sepolia counter address
  const counterAddress = "0x38A26Aa058E0bf6012aC4D015613517f66b4f5d7";
  const baseGas = 42000;

  const tx = {
    to: counterAddress,
    data: MetaRelayer.encodeCall(CounterAbi, "increase", []),
    gasLimit: baseGas,
    value: "0",
  };

  // batch transaction
  const batch5 = Array(5).fill(tx);
  const metaRelayerBatch = await metaRelayer.sendTransactionBatch(batch5, baseGas * batch5.length);
  const singleRelayerBatch = await Promise.all(batch5.map(async (t) => singleRelayer.sendTransaction(t)));

  // gas spent = 55,749
  console.log("MetaRelayer batch tx hash:", metaRelayerBatch.hash);
  
  // gas spent = 26,671 * 5 = 133,355
  console.log("SingleRelayer batch tx hashes:", singleRelayerBatch.map((t) => t.hash));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
