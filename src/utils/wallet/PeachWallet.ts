/* eslint-disable max-lines */
import { BLOCKEXPLORER, NETWORK } from '@env'
import {
  Blockchain,
  BumpFeeTxBuilder,
  DatabaseConfig,
  Descriptor,
  PartiallySignedTransaction,
  TxBuilder,
  Wallet,
} from 'bdk-rn'
import { LocalUtxo, TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { AddressIndex, BlockChainNames, BlockchainEsploraConfig, KeychainKind } from 'bdk-rn/lib/lib/enums'
import { BIP32Interface } from 'bip32'
import { error, info } from '../log'
import { sum } from '../math'
import { parseError } from '../result'
import { findTransactionsToRebroadcast, isPending, mergeTransactionList } from '../transaction'
import { callWhenInternet } from '../web'
import { PeachJSWallet } from './PeachJSWallet'
import { handleTransactionError } from './error/handleTransactionError'
import { storePendingTransactionHex } from './getAndStorePendingTransactionHex'
import { getDescriptorSecretKey } from './getDescriptorSecretKey'
import { getUTXOId } from './getUTXOId'
import { labelAddressByTransaction } from './labelAddressByTransaction'
import { mapTransactionToOffer } from './mapTransactionToOffer'
import { rebroadcastTransactions } from './rebroadcastTransactions'
import { buildDrainWalletTransaction, buildTransaction, getScriptPubKeyFromAddress } from './transaction'
import { transactionHasBeenMappedToOffer } from './transactionHasBeenMappedToOffer'
import { useWalletState } from './walletStore'

type PeachWalletProps = {
  wallet: BIP32Interface
  network?: BitcoinNetwork
  gapLimit?: number
}

export class PeachWallet extends PeachJSWallet {
  initialized: boolean

  synced: boolean

  syncInProgress: Promise<void> | undefined

  descriptorPath: string

  balance: number

  transactions: TransactionDetails[]

  wallet: Wallet | undefined

  blockchain: Blockchain | undefined

  selectedUTXO: LocalUtxo[]

  constructor ({ wallet, network = NETWORK, gapLimit = 25 }: PeachWalletProps) {
    super({ wallet, network, gapLimit })
    this.descriptorPath = `/84'/${network === 'bitcoin' ? '0' : '1'}'/0'/0/*`
    this.balance = 0
    this.transactions = []
    this.selectedUTXO = []
    this.initialized = false
    this.synced = false
    this.syncInProgress = undefined
  }

  loadWallet (seedphrase?: string): Promise<void> {
    this.loadFromStorage()

    return new Promise((resolve) =>
      callWhenInternet(async () => {
        info('PeachWallet - loadWallet - start')

        const descriptorSecretKey = await getDescriptorSecretKey(this.network, seedphrase)
        const externalDescriptor = await new Descriptor().newBip84(
          descriptorSecretKey,
          KeychainKind.External,
          this.network,
        )
        const internalDescriptor = await new Descriptor().newBip84(
          descriptorSecretKey,
          KeychainKind.Internal,
          this.network,
        )

        const config: BlockchainEsploraConfig = {
          baseUrl: BLOCKEXPLORER,
          proxy: null,
          concurrency: 1,
          timeout: 30,
          stopGap: this.gapLimit,
        }

        this.blockchain = await new Blockchain().create(config, BlockChainNames.Esplora)
        const dbConfig = await new DatabaseConfig().memory()

        info('PeachWallet - loadWallet - createWallet')

        this.wallet = await new Wallet().create(externalDescriptor, internalDescriptor, this.network, dbConfig)

        info('PeachWallet - loadWallet - createdWallet')

        this.initialized = true

        this.syncWallet()

        info('PeachWallet - loadWallet - loaded')
        resolve()
      }),
    )
  }

  syncWallet (): Promise<void> {
    if (this.syncInProgress) return this.syncInProgress

    this.syncInProgress = new Promise((resolve, reject) =>
      callWhenInternet(async () => {
        if (!this.wallet || !this.blockchain) return reject(new Error('WALLET_NOT_READY'))

        info('PeachWallet - syncWallet - start')
        this.synced = false

        try {
          const success = await this.wallet.sync(this.blockchain)
          if (success) {
            this.getBalance()
            this.getTransactions()
            this.synced = true
            info('PeachWallet - syncWallet - synced')
          }
        } catch (e) {
          error(parseError(e))
        }

        this.syncInProgress = undefined
        return resolve()
      }),
    )
    return this.syncInProgress
  }

  updateStore (): void {
    useWalletState.getState().setTransactions(this.transactions)
    this.transactions.filter((tx) => !transactionHasBeenMappedToOffer(tx)).forEach(mapTransactionToOffer)
    this.transactions.filter(transactionHasBeenMappedToOffer).forEach(labelAddressByTransaction)
  }

  async getBalance (): Promise<number> {
    if (!this.wallet) throw Error('WALLET_NOT_READY')

    const balance = await this.wallet.getBalance()

    this.balance = Number(balance.total)
    useWalletState.getState().setBalance(this.balance)
    return this.balance
  }

  async getUTXO () {
    if (!this.wallet) throw Error('WALLET_NOT_READY')

    const utxo = await this.wallet.listUnspent()
    return utxo.filter(({ isSpent }) => !isSpent)
  }

  async selectUTXO (utxo: LocalUtxo) {
    const allUTXO = await this.getUTXO()
    const utxoIds = allUTXO.map(getUTXOId)
    if (!utxoIds.includes(getUTXOId(utxo))) return

    this.selectedUTXO.push(utxo)
  }

  unselectUTXO (utxo: LocalUtxo) {
    const idToRemove = getUTXOId(utxo)
    this.selectedUTXO = this.selectedUTXO.filter((utx) => getUTXOId(utx) !== idToRemove)
  }

  async getTransactions (): Promise<TransactionDetails[]> {
    if (!this.wallet) throw Error('WALLET_NOT_READY')

    const transactions = await this.wallet.listTransactions(true)
    this.transactions = mergeTransactionList(this.transactions, transactions)
    const toRebroadcast = findTransactionsToRebroadcast(this.transactions, transactions)

    const pending = this.transactions.filter(isPending)
    await Promise.all(pending.map(storePendingTransactionHex))

    await rebroadcastTransactions(toRebroadcast.map(({ txid }) => txid))
    this.transactions = this.transactions.filter(
      (tx) => tx.confirmationTime?.height || useWalletState.getState().pendingTransactions[tx.txid],
    )

    this.updateStore()

    return this.transactions
  }

  getPendingTransactions () {
    return this.transactions.filter((tx) => !tx.confirmationTime?.height)
  }

  async getLastUnusedAddress () {
    if (!this.wallet) throw Error('WALLET_NOT_READY')
    const addressInfo = await this.wallet.getAddress(AddressIndex.LastUnused)
    return {
      ...addressInfo,
      address: await addressInfo.address.asString(),
    }
  }

  async getAddressByIndex (index: number) {
    const { index: lastUnusedIndex } = await this.getLastUnusedAddress()
    const address = this.getAddress(index)
    return {
      index,
      used: index < lastUnusedIndex,
      address,
    }
  }

  async getReceivingAddress () {
    if (!this.wallet) throw Error('WALLET_NOT_READY')
    const addressInfo = await this.wallet.getAddress(AddressIndex.New)
    return {
      ...addressInfo,
      address: await addressInfo.address.asString(),
    }
  }

  async withdrawAll (address: string, feeRate?: number) {
    if (!this.wallet || !this.blockchain) throw Error('WALLET_NOT_READY')
    info('PeachWallet - withdrawAll - start')
    const drainWalletTransaction = await buildDrainWalletTransaction(address, feeRate)
    const finishedTransaction = await this.finishTransaction(drainWalletTransaction)
    return this.signAndBroadcastPSBT(finishedTransaction.psbt)
  }

  async sendTo (address: string, amount: number, feeRate?: number) {
    const { psbt } = await this.buildAndFinishTransaction(address, amount, feeRate)
    return this.signAndBroadcastPSBT(psbt)
  }

  async buildAndFinishTransaction (address: string, amount: number, feeRate?: number) {
    if (!this.wallet || !this.blockchain) throw Error('WALLET_NOT_READY')
    info('PeachWallet - buildAndFinishTransaction - start')
    const transaction = await buildTransaction(address, amount, feeRate)

    if (this.selectedUTXO.length > 0) transaction.addUtxos(this.selectedUTXO.map((utxo) => utxo.outpoint))

    return this.finishTransaction(transaction)
  }

  getMaxAvailableAmount () {
    if (this.selectedUTXO.length > 0) return this.selectedUTXO.map(({ txout }) => txout.value).reduce(sum, 0)
    return this.balance
  }

  async finishTransaction<T extends TxBuilder | BumpFeeTxBuilder>(transaction: T): Promise<ReturnType<T['finish']>>

  async finishTransaction (transaction: TxBuilder | BumpFeeTxBuilder) {
    if (!this.wallet || !this.blockchain) throw Error('WALLET_NOT_READY')
    info('PeachWallet - finishTransaction - start')
    try {
      return await transaction.finish(this.wallet)
    } catch (e) {
      throw handleTransactionError(parseError(e))
    }
  }

  async signAndBroadcastPSBT (psbt: PartiallySignedTransaction) {
    if (!this.wallet || !this.blockchain) throw Error('WALLET_NOT_READY')
    info('PeachWallet - signAndBroadcastPSBT - start')
    try {
      const signedPSBT = await this.wallet.sign(psbt)
      info('PeachWallet - signAndBroadcastPSBT - signed')

      this.blockchain.broadcast(await signedPSBT.extractTx())
      info('PeachWallet - signAndBroadcastPSBT - broadcasted')
      this.syncWallet()

      info('PeachWallet - signAndBroadcastPSBT - end')

      return psbt
    } catch (e) {
      throw handleTransactionError(parseError(e))
    }
  }

  loadWalletStore (): void {
    this.transactions = useWalletState.getState().transactions
    this.balance = useWalletState.getState().balance
  }

  loadFromStorage (): void {
    if (useWalletState.persist.hasHydrated()) {
      this.loadWalletStore()
    } else {
      useWalletState.persist.onFinishHydration(() => {
        this.loadWalletStore()
      })
    }
  }

  async isMine (address: string): Promise<boolean> {
    if (!this.wallet || !this.blockchain) throw Error('WALLET_NOT_READY')
    const script = await getScriptPubKeyFromAddress(address)
    return this.wallet.isMine(script)
  }
}
