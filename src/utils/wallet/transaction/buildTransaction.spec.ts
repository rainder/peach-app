import { TxBuilder } from 'bdk-rn'
import { LocalUtxo, OutPoint, TxOut } from 'bdk-rn/lib/classes/Bindings'
import { Script } from 'bdk-rn/lib/classes/Script'
import { KeychainKind } from 'bdk-rn/lib/lib/enums'
import { confirmed1 } from '../../../../tests/unit/data/transactionDetailData'
import {
  addressScriptPubKeyMock,
  txBuilderAddRecipientMock,
  txBuilderAddUtxosMock,
  txBuilderCreateMock,
  txBuilderDrainToMock,
  txBuilderDrainWalletMock,
  txBuilderEnableRbfMock,
  txBuilderFeeRateMock,
  txBuilderManuallySelectedOnlyMock,
} from '../../../../tests/unit/mocks/bdkRN'
import { buildTransaction } from './buildTransaction'

describe('buildTransaction', () => {
  const address = 'address'
  const amount = 21000000
  const scriptPubKey = 'scriptPubKey'
  const feeRate = 10
  const outpoint = new OutPoint(confirmed1.txid, 0)
  const txOut = new TxOut(10000, new Script('address'))
  const utxo = new LocalUtxo(outpoint, txOut, false, KeychainKind.External)

  it('builds a transaction with an amount, fee rate, recipientAddress and rbf enabled', async () => {
    addressScriptPubKeyMock.mockResolvedValueOnce(scriptPubKey)
    const transactionResult = await buildTransaction({ address, amount, feeRate })
    expect(txBuilderCreateMock).toHaveBeenCalled()
    expect(txBuilderFeeRateMock).toHaveBeenCalledWith(feeRate)
    expect(txBuilderEnableRbfMock).toHaveBeenCalled()
    expect(txBuilderAddRecipientMock).toHaveBeenCalledWith(scriptPubKey, amount)

    expect(transactionResult).toBeInstanceOf(TxBuilder)
  })
  it('adds utxos to the transaction', async () => {
    addressScriptPubKeyMock.mockResolvedValueOnce(scriptPubKey)
    await buildTransaction({ address, amount, feeRate, utxos: [utxo] })
    expect(txBuilderAddUtxosMock).toHaveBeenCalledWith([outpoint])
  })
  it('drains the wallet if shouldDrainWallet is true', async () => {
    addressScriptPubKeyMock.mockResolvedValueOnce(scriptPubKey)
    const transactionResult = await buildTransaction({ address, shouldDrainWallet: true })
    expect(txBuilderDrainWalletMock).toHaveBeenCalled()
    expect(txBuilderDrainToMock).toHaveBeenCalledWith(scriptPubKey)

    expect(transactionResult).toBeInstanceOf(TxBuilder)
  })
  it('only drains the manually selected utxos if shouldDrainWallet is true and utxos are provided', async () => {
    addressScriptPubKeyMock.mockResolvedValueOnce(scriptPubKey)
    await buildTransaction({ address, shouldDrainWallet: true, utxos: [utxo] })
    expect(txBuilderDrainWalletMock).not.toHaveBeenCalled()
    expect(txBuilderManuallySelectedOnlyMock).toHaveBeenCalled()
    expect(txBuilderDrainToMock).toHaveBeenCalledWith(scriptPubKey)
  })
})
