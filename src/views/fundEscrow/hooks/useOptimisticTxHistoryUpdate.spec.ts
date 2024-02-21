import { act, renderHook } from "test-utils";
import { sellOffer } from "../../../../tests/unit/data/offerData";
import { getTransactionDetails } from "../../../../tests/unit/helpers/getTransactionDetails";
import { saveOffer } from "../../../utils/offer/saveOffer";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { useOptimisticTxHistoryUpdate } from "./useOptimisticTxHistoryUpdate";

jest.useFakeTimers();

describe("useOptimisticTxHistoryUpdate", () => {
  const txDetails = getTransactionDetails().txDetails;
  const offerIds = [sellOffer.id, "39", "40"];
  offerIds.map((id) => saveOffer({ ...sellOffer, id }));
  saveOffer(sellOffer);

  beforeEach(() => {
    useWalletState.getState().reset();
  });
  it("should update the transaction history on wallet state", () => {
    const { result } = renderHook(useOptimisticTxHistoryUpdate);
    result.current(txDetails, sellOffer.id);
    expect(useWalletState.getState().transactions).toEqual([txDetails]);
  });
  it("should update the txOfferMap", () => {
    const { result } = renderHook(useOptimisticTxHistoryUpdate);
    result.current(txDetails, sellOffer.id);
    expect(useWalletState.getState().txOfferMap).toEqual({
      [txDetails.txid]: [sellOffer.id],
    });
  });
  it("should label transaction with offer Id", async () => {
    const { result } = renderHook(useOptimisticTxHistoryUpdate);
    await act(() => {
      result.current(txDetails, sellOffer.id);
    });
    expect(useWalletState.getState().addressLabelMap).toEqual({
      bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh: "P‑26",
    });
  });
  it("should label transaction with multiple offer Ids for fund multiple", async () => {
    const address =
      "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh";
    useWalletState.getState().registerFundMultiple(address, offerIds);
    const { result } = renderHook(useOptimisticTxHistoryUpdate);

    await act(() => {
      result.current(txDetails, sellOffer.id);
    });
    expect(useWalletState.getState().txOfferMap).toEqual({
      [txDetails.txid]: offerIds,
    });
    expect(useWalletState.getState().addressLabelMap).toEqual({
      [address]: "P‑26, P‑27, P‑28",
    });
  });
});
