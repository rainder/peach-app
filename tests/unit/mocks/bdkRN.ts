/* eslint-disable max-classes-per-file */

export const addressScriptPubKeyMock = jest.fn()
export const addressFromScriptMock = jest.fn()
export class Address {
  create = jest.fn().mockReturnThis()

  scriptPubKey = addressScriptPubKeyMock

  fromScript = addressFromScriptMock
}

export const blockChainCreateMock = jest.fn().mockReturnThis()
export const blockchainBroadcastMock = jest.fn()
export class Blockchain {
  create = blockChainCreateMock

  getHeight = jest.fn()

  getBlockHash = jest.fn()

  broadcast = blockchainBroadcastMock

  estimateFee = jest.fn()
}

export const bumpFeeTxBuilderCreateMock = jest.fn().mockReturnThis()
export const bumpFeeTxBuilderEnableRbfMock = jest.fn()
export const bumpFeeTxBuilderFinishMock = jest.fn()
export class BumpFeeTxBuilder {
  create = bumpFeeTxBuilderCreateMock

  allowShrinking = jest.fn()

  enableRbf = bumpFeeTxBuilderEnableRbfMock

  enableRbfWithSequence = jest.fn()

  finish = bumpFeeTxBuilderFinishMock
}
export class DatabaseConfig {
  create = jest.fn().mockReturnThis()

  memory = jest.fn()

  sled = jest.fn()

  sqlite = jest.fn()
}
export class DerivationPath {
  create = jest.fn().mockReturnThis()
}
export class Descriptor {
  create = jest.fn().mockReturnThis()

  asString = jest.fn()

  asStringPrivate = jest.fn()

  newBip44 = jest.fn()

  newBip44Public = jest.fn()

  newBip49 = jest.fn()

  newBip49Public = jest.fn()

  newBip84 = jest.fn()

  newBip84Public = jest.fn()
}
export class DescriptorPublicKey {
  fromString = jest.fn()

  derive = jest.fn()

  extend = jest.fn()

  asString = jest.fn()
}

export const descriptorSecretKeyCreateMock = jest.fn().mockReturnThis()
export class DescriptorSecretKey {
  create = descriptorSecretKeyCreateMock

  derive = jest.fn()

  extend = jest.fn()

  asPublic = jest.fn()

  secretBytes = jest.fn()

  asString = jest.fn()
}

export const mnemonicCreateMock = jest.fn().mockReturnThis()
export const mnemonicFromStringMock = jest.fn().mockReturnThis()
export class Mnemonic {
  create = mnemonicCreateMock

  fromString = mnemonicFromStringMock

  fromEntropy = jest.fn()
}

export const psbtExtractTxMock = jest.fn()
export class PartiallySignedTransaction {
  combine = jest.fn()

  extractTx = psbtExtractTxMock

  serialize = jest.fn()

  txid = jest.fn()

  feeAmount = jest.fn()

  feeRate = jest.fn()
}

const transactionCreateMock = jest.fn().mockReturnThis()
export class Transaction {
  _setTransaction = jest.fn()

  create = transactionCreateMock

  serialize = jest.fn()
}

export const txBuilderCreateMock = jest.fn().mockReturnThis()
export const txBuilderAddRecipientMock = jest.fn()
export const txBuilderFeeRateMock = jest.fn()
export const txBuilderDrainWalletMock = jest.fn()
export const txBuilderEnableRbfMock = jest.fn()
export const txBuilderAddUtxosMock = jest.fn()
export const txBuilderDrainToMock = jest.fn()
export const txBuilderFinishMock = jest.fn()
export class TxBuilder {
  create = txBuilderCreateMock

  addRecipient = txBuilderAddRecipientMock

  addUnspendable = jest.fn()

  addUtxo = jest.fn()

  addUtxos = txBuilderAddUtxosMock

  doNotSpendChange = jest.fn()

  manuallySelectedOnly = jest.fn()

  onlySpendChange = jest.fn()

  unspendable = jest.fn()

  feeRate = txBuilderFeeRateMock

  feeAbsolute = jest.fn()

  drainWallet = txBuilderDrainWalletMock

  drainTo = txBuilderDrainToMock

  enableRbf = txBuilderEnableRbfMock

  enableRbfWithSequence = jest.fn()

  addData = jest.fn()

  setRecipients = jest.fn()

  finish = txBuilderFinishMock
}

export const walletGetBalanceMock = jest.fn().mockResolvedValue({
  trustedPending: 0,
  untrustedPending: 0,
  confirmed: 0,
  spendable: 0,
  total: 0,
})

export const walletGetAddressMock = jest.fn()
export const walletGetInternalAddressMock = jest.fn()
export const walletSyncMock = jest.fn()
export const walletListUnspentMock = jest.fn().mockResolvedValue([])
export const walletListTransactionsMock = jest.fn().mockResolvedValue([])
export const walletSignMock = jest.fn()
export class Wallet {
  create = jest.fn().mockReturnThis()

  getAddress = walletGetAddressMock

  getInternalAddress = walletGetInternalAddressMock

  getBalance = walletGetBalanceMock

  network = jest.fn()

  sync = walletSyncMock

  listUnspent = walletListUnspentMock

  listTransactions = walletListTransactionsMock

  sign = walletSignMock
}

export const mockBDKRN = () =>
  jest.mock('bdk-rn', () => ({
    Address,
    Blockchain,
    BumpFeeTxBuilder,
    DatabaseConfig,
    DerivationPath,
    Descriptor,
    DescriptorPublicKey,
    DescriptorSecretKey,
    Mnemonic,
    PartiallySignedTransaction,
    Transaction,
    TxBuilder,
    Wallet,
  }))
