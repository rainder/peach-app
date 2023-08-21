import { PsbtInput } from 'bip174/src/lib/interfaces'
import { Psbt } from 'bitcoinjs-lib'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'
import { SIGHASH } from '../bitcoin/constants'
import { getEscrowWalletForOffer, setWallet } from '../wallet'
import { signReleaseTransaction } from './signReleaseTransaction'

const verifyReleasePSBTMock = jest.fn()
jest.mock('../../views/contract/helpers/verifyReleasePSBT', () => ({
  verifyReleasePSBT: (...args: unknown[]) => verifyReleasePSBTMock(...args),
}))

describe('verifyAndSignReleaseTx', () => {
  const mockSellOffer = {
    id: '12',
    funding: { txIds: ['txid1'], vouts: [0], amounts: [10000] },
    amount: 10000,
  }
  const mockContract: Partial<Contract> = {
    id: '12-13',
    symmetricKeyEncrypted: 'mockSymmetricKeyEncrypted',
    symmetricKeySignature: 'mockSymmetricKeySignature',
    buyer: { id: 'mockBuyerId', pgpPublicKey: 'mockPgpPublicKey' } as User,
    seller: { id: 'mockSellerId' } as User,
    releasePsbt: 'releasePsbt',
  }
  const finalizeInputMock = jest.fn()

  const psbt: Partial<Psbt> = {
    // @ts-ignore
    data: { inputs: [{ sighashType: SIGHASH.ALL }] as PsbtInput[] },
    signInput: jest.fn().mockReturnValue({ finalizeInput: finalizeInputMock }),
    extractTransaction: jest.fn().mockReturnValue({
      toHex: jest.fn().mockReturnValue('transactionAsHex'),
    }),
    txInputs: [{}] as Psbt['txInputs'],
    txOutputs: [
      { address: 'address1', value: 9000 },
      { address: 'address2', value: 1000 },
    ] as Psbt['txOutputs'],
  }
  setWallet(createTestWallet())

  const wallet = getEscrowWalletForOffer(mockSellOffer as SellOffer)

  it('should sign valid release transaction and return it', () => {
    verifyReleasePSBTMock.mockReturnValueOnce(null)
    const hex = signReleaseTransaction({
      psbt: psbt as Psbt,
      contract: mockContract as Contract,
      sellOffer: mockSellOffer as SellOffer,
      wallet,
    })

    expect(hex).toEqual('transactionAsHex')
    expect(psbt.signInput).toHaveBeenCalled()
    expect(finalizeInputMock).toHaveBeenCalled()
    expect(psbt.extractTransaction).toHaveBeenCalled()
    expect(psbt.extractTransaction?.().toHex).toHaveBeenCalled()
  })
})
