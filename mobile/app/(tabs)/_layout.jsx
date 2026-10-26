// Abas do cliente: Início, Buscar e Perfil · API: nenhuma
import { Tabs } from "expo-router";
import { Home, Search, User } from "lucide-react-native";
import { colors, fonts } from "../../src/theme";

const tab = (title, Icon) => ({
  title,
  tabBarIcon: ({ color, size }) => <Icon size={size - 2} color={color} />,
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryText,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: { fontFamily: fonts.bodySemi, fontSize: 12 },
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border, minHeight: 56 },
      }}
    >
      <Tabs.Screen name="index" options={tab("Início", Home)} />
      <Tabs.Screen name="buscar" options={tab("Buscar", Search)} />
      <Tabs.Screen name="perfil" options={tab("Perfil", User)} />
    </Tabs>
  );
}
