import { createRenderer } from 'react-test-renderer/shallow'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { SellOfferSummary } from './SellOfferSummary'
import { getSellOfferDraft } from '../../../tests/unit/data/offerDraftData'
import { fireEvent, render } from '@testing-library/react-native'
import { Linking } from 'react-native'
import { setPeachWallet } from '../../utils/wallet/setWallet'
import { PeachWallet } from '../../utils/wallet/PeachWallet'

jest.useFakeTimers({ now: new Date('2023-04-26T14:58:49.437Z') })

jest.useFakeTimers({ now: new Date('2022-12-30T23:00:00.000Z') })

describe('SellOfferSummary', () => {
  const renderer = createRenderer()

  it('renders correctly', () => {
    renderer.render(<SellOfferSummary offer={sellOffer} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for sell offers drafts', () => {
    renderer.render(<SellOfferSummary offer={getSellOfferDraft()} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('opens escrow link', () => {
    const escrowAddress = 'escrowAddress'
    // @ts-ignore
    setPeachWallet(new PeachWallet())
    const { getByTestId } = render(<SellOfferSummary offer={{ ...sellOffer, escrow: escrowAddress }} />)
    const openURL = jest.spyOn(Linking, 'openURL')

    fireEvent(getByTestId('showEscrow'), 'onPress')
    expect(openURL).toHaveBeenCalledWith('https://mempool.space/testnet/address/escrowAddress')
  })
})
