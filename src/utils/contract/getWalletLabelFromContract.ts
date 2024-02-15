import { getWalletLabel } from "../offer/getWalletLabel";
import { getSellOfferFromContract } from "./getSellOfferFromContract";

type Params = {
  contract: Contract;
  customAddress?: string | undefined;
  customAddressLabel?: string | undefined;
  isPeachWalletActive: boolean;
};

export const getWalletLabelFromContract = ({
  contract,
  customAddress,
  customAddressLabel,
  isPeachWalletActive,
}: Params) => {
  const sellOffer = getSellOfferFromContract(contract);
  return getWalletLabel({
    address: sellOffer.returnAddress,
    customAddress,
    customAddressLabel,
    isPeachWalletActive,
  });
};
