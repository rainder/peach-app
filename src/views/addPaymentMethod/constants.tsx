import { CurrencyType } from '../../store/offerPreferenes/types'

export const defaultCurrencies: Record<CurrencyType, Currency> = {
  europe: 'EUR',
  latinAmerica: 'ARS',
  other: 'USDT',
}
