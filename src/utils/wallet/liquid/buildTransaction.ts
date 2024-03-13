import { BIP32Interface } from "bip32";
import {
  ElementsValue,
  Transaction as LiquidTransaction,
  address as liquidAddress,
  payments as liquidPayments,
} from "liquidjs-lib";
import { Psbt as LiquidPsbt } from "liquidjs-lib/src/psbt";
import { sum } from "../../math/sum";
import { getLiquidNetwork } from "../getLiquidNetwork";
import { peachLiquidWallet } from "../setWallet";
import { UTXOWithPath } from "../useLiquidWalletState";
import { DUST_LIMIT } from "./constants";

type BuildTransactionProps = {
  recipients: { address: string; amount: number }[];
  miningFees?: number;
  inputs: UTXOWithPath[];
};
export const buildTransaction = ({
  recipients,
  miningFees = 1,
  inputs,
}: BuildTransactionProps): LiquidTransaction => {
  if (!peachLiquidWallet) throw Error("WALLET_NOT_READY");

  const available = inputs.map((utxo) => utxo.value).reduce(sum, 0);
  const amounts = recipients.map((recipient) => recipient.amount);
  const totalAmount = amounts.reduce(sum, 0);
  let finalMiningFees = miningFees;
  const change = available - totalAmount - miningFees;

  if (change < -1)
    throw Error(
      `InsufficientFunds: Insufficient funds: ${available} sat available of ${totalAmount} sat needed`,
    );
  if (amounts.some((amount) => amount < DUST_LIMIT))
    throw Error(`BELOW_DUST_LIMIT`);

  const psbt = new LiquidPsbt();
  const network = getLiquidNetwork();
  const asset = Buffer.concat([
    Buffer.from("01", "hex"),
    Buffer.from(network.assetHash, "hex").reverse(),
  ]);

  recipients.forEach((recipient) => {
    psbt.addOutput({
      script: liquidAddress.toOutputScript(recipient.address, network),
      value: ElementsValue.fromNumber(recipient.amount).bytes,
      nonce: Buffer.from("00", "hex"),
      asset,
    });
  });

  if (change > DUST_LIMIT) {
    const changeAddress = peachLiquidWallet.getInternalAddress().address;
    if (!changeAddress) throw Error("MISSING_CHANGE_ADDRESS");

    psbt.addOutput({
      script: liquidAddress.toOutputScript(changeAddress, network),
      value: ElementsValue.fromNumber(change).bytes,
      nonce: Buffer.from("00", "hex"),
      asset,
    });
  } else if (change > 0) {
    finalMiningFees += change;
  }

  // fees are explicit on liquid
  psbt.addOutput({
    script: Buffer.alloc(0),
    value: ElementsValue.fromNumber(finalMiningFees).bytes,
    nonce: Buffer.from("00", "hex"),
    asset,
  });

  const signers: BIP32Interface[] = [];
  inputs.forEach(({ txid: hash, value, vout: index, derivationPath }) => {
    if (!peachLiquidWallet) throw Error("WALLET_NOT_READY");

    const keyPair = peachLiquidWallet.getKeyPairByPath(derivationPath);
    const payment = liquidPayments.p2wpkh({
      pubkey: keyPair.publicKey,
      network,
    });

    if (!payment.output) throw Error("MISSING_INPUT_SCRIPT");

    signers.push(keyPair);
    psbt.addInput({
      hash,
      index,
      sequence: 0,
      witnessUtxo: {
        script: payment.output,
        value: ElementsValue.fromNumber(value).bytes,
        nonce: Buffer.from("00", "hex"),
        asset,
      },
    });
  });

  psbt.txInputs.forEach((input, i) => {
    const keyPair = signers[i];
    psbt.signInput(i, keyPair);
  });

  psbt.finalizeAllInputs();
  return psbt.extractTransaction();
};
