import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "../../components/Icon";
import { NotificationBubble } from "../../components/bubble/NotificationBubble";
import { PeachText } from "../../components/text/PeachText";
import { useTradeSummaries } from "../../hooks/query/useTradeSummaries";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import { HomeTabName, homeTabNames, homeTabs } from "./homeTabNames";
import { useNotificationStore } from "./notificationsStore";
import { useTranslate } from "@tolgee/react";

const Tab = createBottomTabNavigator();

export function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="home"
      sceneContainerStyle={tw`flex-1`}
      tabBar={() => <Footer />}
      id="homeNavigator"
    >
      {homeTabNames.map((name) => (
        <Tab.Screen
          {...{ name }}
          key={`homeTab-${name}`}
          component={homeTabs[name]}
        />
      ))}
    </Tab.Navigator>
  );
}

function Footer() {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      style={[
        tw`flex-row items-center self-stretch justify-between pt-2 bg-primary-background-main`,
        tw`md:pt-4`,
        { paddingBottom: bottom },
      ]}
    >
      {homeTabNames.map((id) => (
        <FooterItem key={`footer-${id}`} id={id} />
      ))}
    </View>
  );
}

function FooterItem({ id }: { id: HomeTabName }) {
  const currentPage = useRoute<"homeScreen">().params?.screen ?? "home";
  const navigation = useStackNavigation();
  const { summaries } = useTradeSummaries(id === "yourTrades");
  const notifications = useNotificationStore((state) => state.notifications);
  const { t } = useTranslate("global");
  const onPress = () => {
    if (id === "yourTrades") {
      const destinationTab =
        summaries["yourTrades.buy"].length === 0
          ? summaries["yourTrades.sell"].length === 0
            ? summaries["yourTrades.history"].length === 0
              ? "yourTrades.buy"
              : "yourTrades.history"
            : "yourTrades.sell"
          : "yourTrades.buy";

      navigation.navigate("homeScreen", {
        screen: id,
        params: { tab: destinationTab },
      });
    } else {
      navigation.navigate("homeScreen", { screen: id });
    }
  };

  const active = currentPage === id;
  const colorTheme = tw.color(active ? "black-100" : "black-65");
  const size = tw`w-6 h-6`;
  return (
    <TouchableOpacity onPress={onPress} style={tw`items-center flex-1 gap-2px`}>
      <View style={size}>
        {id === "home" ? (
          <Icon
            id={active ? "home" : "homeUnselected"}
            style={size}
            color={colorTheme}
          />
        ) : (
          <Icon id={id} style={size} color={colorTheme} />
        )}
        {id === "yourTrades" ? (
          <NotificationBubble
            notifications={notifications}
            style={tw`absolute -right-2 -top-2`}
          />
        ) : null}
      </View>
      <PeachText
        style={[
          { color: colorTheme },
          id === "home" && active && tw`text-primary-main`,
          tw`leading-relaxed text-center subtitle-1 text-9px`,
        ]}
      >
        {t(`footer.${id}`)}
      </PeachText>
    </TouchableOpacity>
  );
}
