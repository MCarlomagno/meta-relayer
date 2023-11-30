import { getMetarelayerClient, getSingleRelayerClient } from "..";
import { encodeCall } from "../utils";

const CounterAbi = require("./contracts/Counter.json");

async function main() {
  const metaRelayer = getMetarelayerClient();
  const singleRelayer = getSingleRelayerClient();

  // goerli counter address
  const counterAddress = "0x87C42a966E52184F03d569729A51F5d0142A603F";
  const baseGas = 21000;

  const metaRelayerTx = await metaRelayer.sendTransaction({
    to: counterAddress,
    data: encodeCall(CounterAbi, "increase", []),
    gasLimit: baseGas * 2,
    value: "0",
  });

  const singleRelayerTx = await singleRelayer.sendTransaction({
    to: counterAddress,
    data: encodeCall(CounterAbi, "increase", []),
    gasLimit: baseGas * 2,
    value: "0",
  });

  console.log("MetaRelayer tx hash:", metaRelayerTx.hash);
  // cost -> 560091000 wei

  console.log("SingleRelayer tx hash:", singleRelayerTx.hash);
  // cost -> 560091 wei
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
