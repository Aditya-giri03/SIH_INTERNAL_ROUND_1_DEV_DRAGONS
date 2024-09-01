import { Tabs } from 'expo-router';
import { Home, FileCheck } from 'lucide-react-native';
import { Text } from 'react-native';

const OfficerLayout = () => (
  <Tabs
    screenOptions={{
      tabBarStyle: {
        padding: 12,
        height: 60,
      },
    }}
  >
    <Tabs.Screen
      name="Dashboard"
      options={{
        title: 'Dashboard',
        tabBarIcon: ({ focused }) => {
          return <Home color={focused ? 'red' : 'gray'} size={28} />;
        },
        tabBarLabel: ({ focused }) => (
          <Text
            style={{
              fontSize: 13, // Larger font size
              fontWeight: 'bold', // Bold font
              paddingBottom: 6,
              color: focused ? 'red' : 'gray',
            }}
          >
            Dashboard
          </Text>
        ),
      }}
    />
    <Tabs.Screen
      name="Approvals"
      options={{
        title: 'Bill Approvals',
        tabBarIcon: ({ focused }) => {
          return <FileCheck color={focused ? 'red' : 'gray'} size={28} />;
        },
        tabBarLabel: ({ focused }) => (
          <Text
            style={{
              fontSize: 13, // Larger font size
              fontWeight: 'bold', // Bold font
              paddingBottom: 6,
              color: focused ? 'red' : 'gray',
            }}
          >
            Approvals
          </Text>
        ),
      }}
    />
  </Tabs>
);

export default OfficerLayout;
