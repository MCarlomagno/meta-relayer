import {
  Relayer,
  RelayerTransactionPayload,
} from "@openzeppelin/defender-sdk-relay-signer-client";
import { buildSendBatchCalldata, buildSendCalldata } from "./utils";
import * as dotenv from "dotenv";

dotenv.config();

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
      data: buildSendCalldata(payload),
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
      data: buildSendBatchCalldata(payloads),
      gasPrice: "21000",
      gasLimit,
    });
    this.nextIndex();
    return tx;
  }
}
