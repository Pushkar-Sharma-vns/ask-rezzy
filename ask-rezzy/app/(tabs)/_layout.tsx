
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: 'none' }, // Hide the tab bar
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ask Rezzy',
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Past Chats',
          href: null, // Hide this tab completely
        }}
      />
    </Tabs>
  );
}
