import { APPVERSION } from '../../constants'
import { setDisplayCurrencyQuiet } from '../../contexts/bitcoin'
import { setLocaleQuiet } from '../i18n'
import { setPeachAccount } from '../peachAPI/peachAccount'
import { createWallet, getMainAddress, setWallet, wallet } from '../wallet'

export const defaultAccount: Account = {
  publicKey: '',
  settings: {
    appVersion: APPVERSION,
    displayCurrency: 'EUR',
    locale: 'en',
    preferredCurrencies: [],
    preferredPaymentMethods: {},
    meansOfPayment: {},
    showBackupReminder: false,
    showDisputeDisclaimer: true,
  },
  paymentData: [],
  tradingLimit: {
    daily: 1000,
    dailyAmount: 0,
    yearly: 100000,
    yearlyAmount: 0,
  },
  offers: [],
  contracts: [],
  chats: {},
  pgp: {
    privateKey: '',
    publicKey: '',
  },
}

export let account = defaultAccount

export const getAccount = () => account

/**
 * @description Method to set account for app session
 */
export const setAccount = async (acc: Account, overwrite?: boolean) => {
  account = overwrite
    ? acc
    : {
      ...defaultAccount,
      ...acc,
      settings: {
        ...defaultAccount.settings,
        ...acc.settings,
      },
      tradingLimit: defaultAccount.tradingLimit,
    }

  setDisplayCurrencyQuiet(account.settings.displayCurrency || 'EUR')
  setLocaleQuiet(account.settings.locale || 'en')

  setWallet((await createWallet(account.mnemonic)).wallet)

  const firstAddress = getMainAddress(wallet)
  setPeachAccount(firstAddress)
}
