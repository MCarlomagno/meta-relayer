import { getMetarelayerClient, getSingleRelayerClient } from "..";
import { buildSendBatchCalldata, buildSendCalldata, encodeCall } from "../utils";

const CounterAbi = require("../examples/contracts/Counter.json");

async function main() {
  const metaRelayer = getMetarelayerClient();
  const singleRelayer = getSingleRelayerClient();

  // goerli counter address
  const counterAddress = "0x87C42a966E52184F03d569729A51F5d0142A603F";

  const relayer = await singleRelayer.getRelayer();
  const provider = singleRelayer.getProvider();

  // tx increments the counter for the contract.
  const tx = {
    from: relayer.address,
    to: counterAddress,
    value: "0x0",
    data: encodeCall(CounterAbi, "increase", []),
    gasLimit: 42000,
  };

  const resultSingle = await provider.estimateGas(tx);
  const resultMeta = await provider.estimateGas({
    ...tx,
    to: metaRelayer.address,
    data: buildSendCalldata(tx)
  });

  console.log('================================');
  console.log('Gas cost for single transaction:')
  console.log(`Cost single-relayer: ${resultSingle}`);
  console.log(`Cost meta-relayer: ${resultMeta}`);
  console.log('================================');

  const batch5 = Array(5).fill(tx);
  const metaTx = buildSendBatchCalldata(batch5);
  const resultBatch = await provider.estimateGas({
    ...tx,
    gasLimit: tx.gasLimit * batch5.length,
    to: metaRelayer.address,
    data: metaTx
  });

  console.log('================================');
  console.log('Gas cost for batch: 5 transactions');
  console.log(`Cost single-relayer: ${Number(resultSingle) * batch5.length}`);
  console.log(`Cost meta-relayer: ${resultBatch }`);
  console.log('================================');

  const batch10 = Array(10).fill(tx);
  const metaTx10 = buildSendBatchCalldata(batch10);
  const resultBatch10 = await provider.estimateGas({
    ...tx,
    gasLimit: tx.gasLimit * batch10.length,
    to: metaRelayer.address,
    data: metaTx10
  });

  console.log('================================');
  console.log('Gas cost for batch: 10 transactions');
  console.log(`Cost single-relayer: ${Number(resultSingle) * batch10.length}`);
  console.log(`Cost meta-relayer: ${resultBatch10 }`);
  console.log('================================');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});