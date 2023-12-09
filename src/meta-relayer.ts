import {
  Relayer,
  RelayerTransactionPayload,
} from "@openzeppelin/defender-sdk-relay-signer-client";
import { Interface } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const ABI = require("./cmd/contracts/abi/MetaRelayer.json");

export class MetaRelayer {
  private currentIndex: number;
  private relayerClients: Relayer[];
  public address: string;

  constructor(_relayerClients: Relayer[]) {
    if (!process.env.META_RELAYER_CONTRACT_ADDRESS) {
      throw new Error("META_RELAYER_CONTRACT_ADDRESS not found");
    }
    this.currentIndex = 0;
    this.relayerClients = _relayerClients;
    this.address = process.env.META_RELAYER_CONTRACT_ADDRESS;
  }

  private nextIndex() {
    if (this.currentIndex === this.relayerClients.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
  };

  public async sendTransaction(payload: RelayerTransactionPayload) {
    const relayer = this.relayerClients[this.currentIndex];

    const tx = await relayer.sendTransaction({
      to: process.env.META_RELAYER_CONTRACT_ADDRESS,
      data: MetaRelayer.buildSendCalldata(payload),
      gasPrice: "21000",
      ...payload,
    });
    this.nextIndex();
    return tx;
  }

  public async sendTransactionBatch(
    payloads: RelayerTransactionPayload[],
    gasLimit?: number,
  ) {
    const relayer = this.relayerClients[this.currentIndex];

    const tx = await relayer.sendTransaction({
      to: process.env.META_RELAYER_CONTRACT_ADDRESS,
      data: MetaRelayer.buildSendBatchCalldata(payloads),
      gasPrice: "21000",
      gasLimit,
    });
    this.nextIndex();
    return tx;
  }

  static encodeCall(abi: string, input: string, args: any[]) {
    const iface = new Interface(abi);
    const encodedCall = iface.encodeFunctionData(input, args);
    return encodedCall;
  }

  static buildSendBatchCalldata(payloads: RelayerTransactionPayload[]) {
    const { toArray, dataArray, valueArray } = payloads.reduce(
      (acc, curr) => {
        acc.toArray.push(curr.to);
        acc.dataArray.push(curr.data);
        acc.valueArray.push(curr.value);
        return acc;
      },
      { toArray: [], dataArray: [], valueArray: [] },
    );
  
    const encodedCall = this.encodeCall(ABI, "sendBatch", [
      toArray,
      dataArray,
      valueArray,
    ]);
    return encodedCall;
  }
  
  static buildSendCalldata(payload: RelayerTransactionPayload) {
    const { to, data } = payload;
    const encodedCall = this.encodeCall(ABI, "send", [to, data]);
    return encodedCall;
  }
}
