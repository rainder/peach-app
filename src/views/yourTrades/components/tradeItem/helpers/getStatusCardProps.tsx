import { Icon } from '../../../../../components'
import { statusCardStyles } from '../../../../../components/statusCard/StatusCard'
import tw from '../../../../../styles/tailwind'
import { contractIdToHex } from '../../../../../utils/contract'
import { getShortDateFormat } from '../../../../../utils/date/getShortDateFormat'
import { offerIdToHex } from '../../../../../utils/offer'
import { getThemeForTradeItem, isContractSummary, isPastOffer } from '../../../utils'
import { getActionIcon, getActionLabel } from '../utils'

export const getStatusCardProps = (item: TradeSummary) => {
  const { tradeStatus, paymentMade, creationDate, id } = item
  const isContract = isContractSummary(item)

  const { color, iconId } = getThemeForTradeItem(item)

  const title = isContract ? contractIdToHex(id) : offerIdToHex(id)

  const date = new Date(paymentMade || creationDate)
  const subtext = getShortDateFormat(date)

  const isWaiting = color === 'primary-mild' && isContract
  const label = getActionLabel(item, isWaiting)
  const labelIconId = getActionIcon(item, isWaiting)
  const labelIcon = labelIconId && <Icon id={labelIconId} size={17} color={tw.color(statusCardStyles.text[color])} />

  const icon = isPastOffer(tradeStatus) ? (
    <Icon id={iconId} size={16} color={tw.color(statusCardStyles.border[color])} />
  ) : undefined

  return {
    title,
    icon,
    subtext,
    label,
    labelIcon,
    color,
  }
}
