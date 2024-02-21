import { View, ViewStyle } from "react-native";
import { ProfileInfo } from "../../components/ProfileInfo";
import { Screen } from "../../components/Screen";
import { TouchableRedText } from "../../components/text/TouchableRedText";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import { AccountInfo } from "../settings/profile/AccountInfo";
import { useBlockUser } from "./useBlockUser";
import { useUnblockUser } from "./useUnblockUser";
import { useUser } from "./useUser";
import { useUserStatus } from "./useUserStatus";
import { useTranslate } from "@tolgee/react";

export const PublicProfile = () => {
  const { t } = useTranslate("profile");
  const { userId } = useRoute<"publicProfile">().params;
  const { user, isLoading } = useUser(userId);
  if (isLoading || !user) return <></>;

  return (
    <Screen header={t("profile.user.title")}>
      <View style={tw`gap-12 grow`}>
        <ProfileInfo user={user} />
        <AccountInfo user={user} />
      </View>
      <BlockUser style={tw`self-center`} />
    </Screen>
  );
};

function BlockUser({ style }: { style?: ViewStyle }) {
  const { t } = useTranslate("profile");
  const { userId } = useRoute<"publicProfile">().params;
  const { data } = useUserStatus(userId);

  const { mutate: blockUser } = useBlockUser(userId);
  const { mutate: unblockUser } = useUnblockUser(userId);
  const onPress = () => {
    if (!data) return;
    if (data.isBlocked) {
      unblockUser();
    } else {
      blockUser();
    }
  };

  return (
    <TouchableRedText
      style={style}
      iconId={data?.isBlocked ? "rotateCounterClockwise" : "userX"}
      onPress={onPress}
    >
      {t(data?.isBlocked ? "profile.unblockUser" : "profile.blockUser")}
    </TouchableRedText>
  );
}
