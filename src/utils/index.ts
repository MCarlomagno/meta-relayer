import { RelayerTransactionPayload } from '@openzeppelin/defender-sdk-relay-signer-client';
import { Interface } from 'ethers';

const ABI = require('../contract/abi/MetaRelayer.json');

export function encodeCall(abi: string, input: string, args: any[]) {
  const iface = new Interface(abi);
  const encodedCall = iface.encodeFunctionData(input, args);
  return encodedCall;
}

export function buildSendBatchCalldata(payloads: RelayerTransactionPayload[]) {
  const { toArray, dataArray, valueArray } = payloads.reduce((acc, curr) => {
    acc.toArray.push(curr.to);
    acc.dataArray.push(curr.data);
    acc.valueArray.push(curr.value);
    return acc;
  }, { toArray: [], dataArray: [], valueArray: [] });

  const encodedCall = encodeCall(ABI, "sendBatch", [ toArray, dataArray, valueArray ]);
  return encodedCall;
}

export function buildSendCalldata(payload: RelayerTransactionPayload) {
  const { to, data } = payload;
  const encodedCall = encodeCall(ABI, "send", [ to, data ]);
  return encodedCall;
}