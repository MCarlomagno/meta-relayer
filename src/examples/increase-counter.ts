
import { MetaRelayer } from "../meta-relayer";
import { Relayer } from "@openzeppelin/defender-sdk-relay-signer-client";

const CounterAbi = require("./contracts/Counter.json");

async function main() {
  const singleRelayer = new Relayer({
    apiKey: process.env.RELAYER_API_KEY,
    apiSecret: process.env.RELAYER_API_SECRET,
  });
  const metaRelayer = new MetaRelayer([singleRelayer]);

  // goerli counter address
  const counterAddress = "0x87C42a966E52184F03d569729A51F5d0142A603F";
  const baseGas = 42000;

  const tx = {
    to: counterAddress,
    data: MetaRelayer.encodeCall(CounterAbi, "increase", []),
    gasLimit: baseGas,
    value: "0",
  };

  // single transaction
  // const metaRelayerTx = await metaRelayer.sendTransaction(tx);
  // const singleRelayerTx = await singleRelayer.sendTransaction(tx);

  // console.log("MetaRelayer tx hash:", metaRelayerTx.hash);
  // console.log("SingleRelayer tx hash:", singleRelayerTx.hash);

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
