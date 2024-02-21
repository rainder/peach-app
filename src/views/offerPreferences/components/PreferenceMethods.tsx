import { useOfferPreferences } from "../../../store/offerPreferences";
import { Methods } from "./Methods";

export function PreferenceMethods({ type }: { type: "buy" | "sell" }) {
  const meansOfPayment = useOfferPreferences((state) => state.meansOfPayment);

  return <Methods type={type} meansOfPayment={meansOfPayment} />;
}
