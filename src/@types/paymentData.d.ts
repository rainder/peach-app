declare type PaymentDataInfo = {
  accountNumber?: string
  beneficiary?: string
  bic?: string
  email?: string
  iban?: string
  name?: string
  phone?: string
  reference?: string
  ukBankAccount?: string
  ukSortCode?: string
  userName?: string
  wallet?: string
}

declare type PaymentDataField = keyof PaymentDataInfo

declare type PaymentData = PaymentDataInfo & {
  id: string
  label: string
  type: PaymentMethod
  currencies: Currency[]
  country?: PaymentMethodCountry
  hidden?: boolean
  reference?: string
}
