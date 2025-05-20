import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { hp } from "../../helper/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";

export default function PagesLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#99B3FF",
          height: hp(7),
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          overflow: 'hidden',
        },
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#000",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="newPost"
        options={{
          title: "New Post",
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "friends",
          tabBarIcon: ({ color, size }) => (
            <Icon name="userGroup" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
          ),
        }}
      />

      {/* ẨN các màn hình không nên là tab */}
      <Tabs.Screen name="editProfile" options={{ href: null }} />
      <Tabs.Screen name="notification" options={{ href: null }} />
      <Tabs.Screen name="postDetails" options={{ href: null }} />
      <Tabs.Screen name="message" options={{ href: null }} />
      <Tabs.Screen name="messageDetails" options={{ href: null, tabBarStyle: { display: 'none' }, }}  />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
