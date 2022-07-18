import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import { Dropdown, Headline, Icon, SatsFormat, Text, Title } from '../../components'
import i18n from '../../utils/i18n'
import { BUCKETS, DEPRECATED_BUCKETS } from '../../constants'
import BitcoinContext from '../../contexts/bitcoin'
import { SellViewProps } from './Sell'
import { account, getTradingLimit, updateSettings } from '../../utils/account'
import { applyTradingLimit } from '../../utils/account/tradingLimit'
import Sats from '../../overlays/info/Sats'
import { OverlayContext } from '../../contexts/overlay'
import Hint from '../../components/Hint'

// eslint-disable-next-line max-lines-per-function
export default ({ offer, updateOffer, setStepValid, navigation }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const [{ currency, satsPerUnit, prices }] = useContext(BitcoinContext)
  const [amount, setAmount] = useState(offer.amount)
  const [random, setRandom] = useState(0)

  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    updateOffer({ ...offer, amount })
    updateSettings({ amount }, true)
    setStepValid(true)
  }, [amount])

  useEffect(() => {
    setStepValid(true)
  }, [])


  const onChange = (value: string|number) => setAmount(value as number)
  const onToggle = (isOpen: boolean) => setDropdownOpen(isOpen)

  const allowedSellBuckets = BUCKETS.filter(b => DEPRECATED_BUCKETS.indexOf(b) === -1)
  const dropdownItems = applyTradingLimit(allowedSellBuckets, prices.CHF as number, getTradingLimit()).map(value => ({
    value,
    display: (isOpen: boolean) => <View style={tw`flex-row justify-between items-center`}>
      <SatsFormat sats={value} format="big"/>
      {isOpen && satsPerUnit
        ? <Text style={tw`font-mono text-peach-1`}>
          {i18n(`currency.format.${currency}`, String(Math.round(value / satsPerUnit)))}
        </Text>
        : null
      }
    </View>
  }))

  const openSatsHelp = () => updateOverlay({ content: <Sats view="seller" />, showCloseButton: true, help: true })
  const goToBackups = () => navigation.navigate('backups', {})
  const dismissBackupReminder = () => {
    updateSettings({
      showBackupReminder: false
    })
    setRandom(Math.random())
  }

  return <View testID="view-sell" style={tw`h-full flex`}>
    <Title title={i18n('sell.title')} />
    <View style={tw`h-full flex-shrink flex justify-center z-10`}>
      <View>
        <Headline style={tw`mt-16 text-grey-1 px-5`}>
          {i18n('sell.subtitle')}
        </Headline>
        <View style={tw`z-10`}>
          <View style={tw`w-full absolute flex-row items-start justify-center mt-3`}>
            <Dropdown
              testID="sell-amount"
              style={tw`max-w-xs flex-shrink`}
              items={dropdownItems}
              selectedValue={amount}
              onChange={onChange} onToggle={onToggle}
            />
            <Pressable onPress={openSatsHelp} style={tw`mt-1`}>
              <View style={tw`w-8 h-8 flex items-center justify-center`}>
                <Icon id="help" style={tw`w-5 h-5`} color={tw`text-blue-1`.color as string} />
              </View>
            </Pressable>
          </View>
        </View>
        {satsPerUnit
          ? <Text style={tw`mt-4 mt-16 font-mono text-peach-1 text-center`}>
            ≈ {i18n(`currency.format.${currency}`, String(Math.round(amount / satsPerUnit)))}
          </Text>
          : null
        }
      </View>
    </View>
    {account.settings.showBackupReminder !== false
      ? <View style={tw`flex items-center mt-2`}>
        <Hint
          style={tw`max-w-xs`}
          title={i18n('hint.backup.title')}
          text={i18n('hint.backup.text')}
          icon="lock"
          onPress={goToBackups}
          onDismiss={dismissBackupReminder}
        />
      </View>
      : null
    }
  </View>
}