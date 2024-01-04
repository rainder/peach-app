import { strictEqual } from 'assert'
import * as contractData from '../../../peach-api/src/testData/contract'
import * as accountData from '../../../tests/unit/data/accountData'
import { setAccount } from '../account/account'
import { getOfferIdFromContract } from './getOfferIdFromContract'

describe('getOfferIdFromContract', () => {
  it('gets offer id for seller', () => {
    setAccount(accountData.seller)
    strictEqual(getOfferIdFromContract(contractData.contract), '14')
  })
  it('gets offer id for buyer', () => {
    setAccount(accountData.buyer)
    strictEqual(getOfferIdFromContract(contractData.contract), '15')
  })
})
