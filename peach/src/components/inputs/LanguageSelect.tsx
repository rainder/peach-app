import React, { createContext, ReactElement } from 'react'
import { Text, View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import Select from './Select'

/**
 * @description Context for localization
 * @example
 * import LanguageContext from './components/inputs/LanguageSelect'
 *
 * export default (): ReactElement =>
 *   const { locale } = useContext(LanguageContext)
 *   return <Text>
 *     {locale}
 *   </Text>
 * }
 */
const LanguageContext = createContext({ locale: 'en' })


export default LanguageContext

interface LanguageSelectProps {
  locale: string,
  setLocale: Function
}

/**
 * @description Component to display the language select
 * @param props Component properties
 * @param props.locale the current locale
 * @param props.setLocale method to set locale on value change
 */
export const LanguageSelect = ({ locale, setLocale }: LanguageSelectProps): ReactElement => {
  const languages = i18n.getLocales().map(lcl => ({
    value: lcl,
    text: i18n(`languageName.${lcl}`)
  }))

  return <View>
    <View style={tw`mt-4 w-40`}>
      <Text>{i18n('language')}</Text>
      <Select
        items={languages}
        selectedValue={locale}
        onChange={e => setLocale({ locale: e.currentTarget.value })}
      />
    </View>
  </View>
}