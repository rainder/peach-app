import React, { ReactElement } from 'react'
import { StackNavigation } from '../../utils/navigation'
import CreateOffer from '../CreateOffer'
type Props = {
  navigation: StackNavigation
}

export default ({ navigation }: Props): ReactElement => <CreateOffer {...{ navigation, page: 'buy' }} />
