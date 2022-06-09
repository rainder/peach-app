import { create } from 'twrnc'
import { Dimensions } from 'react-native'
import { NETWORK } from '@env'

type Style = {
  [key: string]: string[] | string | number | boolean | Style;
}
interface Tailwind {
  (classes: TemplateStringsArray): Style,
  md: (classes: TemplateStringsArray) => Style,
  lg: (classes: TemplateStringsArray) => Style
}
const tailwind = create(require(NETWORK === 'bitcoin' ? '../../tailwind.config' : '../../tailwind-dev.config'))

/**
 * @example [tw`mt-2 text-lg`, tw.md`mt-4 text-xl`, tw.lg`mt-5 text-2xl`]
 */
const tw: Tailwind = cls => tailwind(cls)
tw.md = cls => {
  const { width, height } = Dimensions.get('window')
  return (width || 0) > 375 && (height || 0) > 690
    ? tailwind(cls)
    : {}
}
tw.lg = cls => {
  const { width } = Dimensions.get('window')
  return (width || 0) >= 1200
    ? tailwind(cls)
    : {}
}

export default tw