import { strictEqual } from 'assert'
import { setAccount } from '../../../../src/utils/account'
import { getOfferIdfromContract } from '../../../../src/utils/contract'
import * as accountData from '../../data/accountData'

describe('getOfferIdfromContract', () => {
  it('gets offer id for seller', async () => {
    await setAccount(accountData.seller)
    strictEqual(getOfferIdfromContract(accountData.contract), 'PE')
  })
  it('gets offer id for buyer', async () => {
    await setAccount(accountData.buyer)
    strictEqual(getOfferIdfromContract(accountData.contract), 'PF')
  })
})
