import { useEffect, useMemo } from "react";
import { View } from "react-native";
import { Icon } from "../../../../components/Icon";
import { Loading } from "../../../../components/animation/Loading";
import { BitcoinAddress } from "../../../../components/bitcoin/BitcoinAddress";
import { LightningInvoiceInput } from "../../../../components/inputs/LightningInvoiceInput";
import { useClosePopup } from "../../../../components/popup/GlobalPopup";
import { PopupAction } from "../../../../components/popup/PopupAction";
import { PopupComponent } from "../../../../components/popup/PopupComponent";
import { PeachText } from "../../../../components/text/PeachText";
import { CopyAble } from "../../../../components/ui/CopyAble";
import { useValidatedState } from "../../../../hooks/useValidatedState";
import tw from "../../../../styles/tailwind";
import { SubmarineAPIResponse } from "../../../../utils/boltz/api/postSubmarineSwap";
import { useSwapStatus } from "../../../../utils/boltz/query/useSwapStatus";
import i18n from "../../../../utils/i18n";
import { useCreateInvoice } from "../../hooks/useCreateInvoice";
import { MSAT_PER_SAT } from "../../hooks/useLightningWalletBalance";
import { ClaimSubmarineSwap } from "./ClaimSubmarineSwap";
import { useSwapOut } from "./hooks/useSwapOut";

const CLOSE_POPUP_TIMEOUT = 5000;

type SetInvoicePopupContentProps = {
  status?: string;
  invoice: string;
  setInvoice: (invoice: string) => void;
  invoiceErrors: string[];
  swapInfo?: SubmarineAPIResponse;
  amount: number;
  keyPairWIF?: string;
};
const SetInvoicePopupContent = ({
  status,
  invoice,
  setInvoice,
  invoiceErrors,
  swapInfo,
  amount,
  keyPairWIF,
}: SetInvoicePopupContentProps) => {
  if (status === "transaction.claimed")
    return (
      <View style={tw`gap-4 items-center`}>
        <Icon size={128} id="checkCircle" color={tw.color(`success-main`)} />
      </View>
    );

  if (status === "invoice.set" && swapInfo?.address)
    return (
      <View style={tw`gap-4 items-center`}>
        <PeachText selectable>
          {i18n("wallet.swap.sendToAddress")} {swapInfo.expectedAmount}
          <CopyAble value={String(swapInfo.expectedAmount)} />
        </PeachText>
        <BitcoinAddress address={swapInfo.address} amount={amount} />
      </View>
    );

  if (status === "transaction.claim.pending" && swapInfo && keyPairWIF) {
    return <ClaimSubmarineSwap {...{ invoice, swapInfo, keyPairWIF }} />;
  }

  return (
    <>
      <PeachText selectable>
        Create an invoice for {i18n("currency.format.sats", String(amount))}
      </PeachText>
      <CopyAble value={String(amount)} />
      <LightningInvoiceInput
        onChangeText={setInvoice}
        value={invoice}
        errorMessage={invoiceErrors}
      />
    </>
  );
};

type SetInvoicePopupProps = {
  amount: number;
  miningFees: number;
};
export const SetInvoicePopup = ({
  amount,
  miningFees,
}: SetInvoicePopupProps) => {
  const closePopup = useClosePopup();
  const lightningInvoiceRules = useMemo(
    () => ({
      required: true,
      lightningInvoice: true,
      invoiceHasCorrectAmount: amount,
    }),
    [amount],
  );
  const [invoice, setInvoice, isInvoiceValid, invoiceErrors] =
    useValidatedState<string>("", lightningInvoiceRules);
  const { swapOut, postSwapInProgress, swapInfo, keyPairWIF } = useSwapOut({
    miningFees,
    invoice,
  });
  const { status } = useSwapStatus({ id: swapInfo?.id });
  const {
    invoice: createdInvoice,
    createInvoice,
    isCreatingInvoice,
  } = useCreateInvoice({
    amountMsat: amount * MSAT_PER_SAT,
    description: "Boltz Swap out",
  });
  useEffect(() => {
    createInvoice();
  }, [createInvoice, setInvoice]);
  useEffect(() => {
    if (createdInvoice) setInvoice(createdInvoice);
  }, [createdInvoice, setInvoice]);

  if (status?.status === "transaction.claimed") {
    setTimeout(closePopup, CLOSE_POPUP_TIMEOUT);
  }

  return (
    <PopupComponent
      title={i18n("wallet.swap.invoice")}
      bgColor={tw`bg-info-background`}
      actionBgColor={tw`bg-info-light`}
      content={
        isCreatingInvoice ? (
          <Loading />
        ) : (
          <SetInvoicePopupContent
            {...{
              status: status?.status,
              invoice,
              setInvoice,
              invoiceErrors,
              swapInfo,
              amount,
              keyPairWIF,
            }}
          />
        )
      }
      actions={
        <>
          <PopupAction
            label={i18n("close")}
            iconId="xSquare"
            onPress={closePopup}
          />
          <PopupAction
            testID="popup-action-swapOut"
            label={i18n("wallet.swap")}
            iconId="checkSquare"
            onPress={swapOut}
            disabled={
              !isInvoiceValid || status?.status === "transaction.claimed"
            }
            loading={postSwapInProgress}
            reverseOrder
          />
        </>
      }
    />
  );
};
