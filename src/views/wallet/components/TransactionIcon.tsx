import { ColorValue } from "react-native";
import { IconType } from "../../../assets/icons";
import { Icon } from "../../../components/Icon";
import tw from "../../../styles/tailwind";

export type TxIcon = {
  id: IconType;
  color: ColorValue | undefined;
};

const iconMap: Record<TransactionType, TxIcon> = {
  TRADE: { id: "buy", color: tw.color("success-main") },
  ESCROWFUNDED: { id: "sell", color: tw.color("primary-main") },
  WITHDRAWAL: { id: "arrowUpCircle", color: tw.color("primary-main") },
  DEPOSIT: { id: "arrowDownCircle", color: tw.color("success-main") },
  REFUND: { id: "rotateCounterClockwise", color: tw.color("black-50") },
  SWAP: { id: "shuffle", color: tw.color("info-light") },
};

type Props = {
  type: TransactionType;
  size: number;
};

export const TransactionIcon = ({ type, size }: Props) => (
  <Icon size={size} id={iconMap[type].id} color={iconMap[type].color} />
);
