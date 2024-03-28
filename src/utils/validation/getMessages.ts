import i18n from "../i18n";
import {getValidMobileNetworks} from "./isValidMobileNetwork";

export const getMessages = () => ({
  account: i18n("form.account.error"),
  advcashWallet: i18n("form.wallet.error"),
  bic: i18n("form.bic.error"),
  bip39: i18n("form.bip39.error"),
  bip39Word: i18n("form.bip39Word.error"),
  bitcoinAddress: i18n("form.address.btc.error"),
  duplicate: i18n("form.duplicate.error"),
  email: i18n("form.email.error"),
  feeRate: i18n("form.feeRate.error"),
  iban: i18n("form.iban.error"),
  isBancolombiaAccountNumber: i18n("form.account.errors"),
  isCBU: i18n("form.invalid.error"),
  isCVU: i18n("form.invalid.error"),
  isCVUAlias: i18n("form.invalid.error"),
  isEUIBAN: i18n("form.iban.nonEUError"),
  isNUBAN: i18n("form.account.errors"),
  isPhoneAllowed: i18n("form.phone.highRisk"),
  isValidPaymentReference: i18n("form.reference.error"),
  max: i18n("form.max.error"),
  min: i18n("form.min.error"),
  nationalTransferBG: i18n("form.account.errors"),
  nationalTransferCZ: i18n("form.account.errors"),
  nationalTransferDK: i18n("form.account.errors"),
  nationalTransferHU: i18n("form.account.errors"),
  nationalTransferNO: i18n("form.account.errors"),
  nationalTransferPL: i18n("form.account.errors"),
  nationalTransferRO: i18n("form.account.errors"),
  number: i18n("form.invalid.error"),
  password: i18n("form.password.error"),
  paypalUserName: i18n("form.invalid.error"),
  phone: i18n("form.invalid.error"),
  referralCode: i18n("form.invalid.error"),
  referralCodeTaken: i18n("form.referral.alreadyTaken"),
  required: i18n("form.required.error"),
  revtag: i18n("form.invalid.error"),
  signature: i18n("form.signature.error"),
  straksbetaling: i18n("form.account.errors"),
  tetherAddress: i18n("form.address.error"),
  ukBankAccount: i18n("form.ukBankAccount.error"),
  ukSortCode: i18n("form.ukSortCode.error"),
  url: i18n("form.invalid.error"),
  userName: i18n("form.invalid.error"),
  edrpou: i18n("form.edrpou.error"),
  steam: i18n("form.steam.error"),
  upi: i18n("form.upiTag.error"),
  cpf: i18n("form.cpf.error"),
  rut: i18n("form.rut.error"),
  dni: i18n("form.dni.error"),
  mobileNetwork: i18n("form.mobileNetwork.error", getValidMobileNetworks().toString()),
  // mobileNetwork: i18n("form.mobileNetwork.error", { networks: getValidMobileNetworks().toString() }),
});
