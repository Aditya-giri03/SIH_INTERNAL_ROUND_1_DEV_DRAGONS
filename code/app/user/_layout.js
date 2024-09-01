import { Tabs } from 'expo-router';
import { Home, FileText, FilePlus } from 'lucide-react-native';

const UserLayout = () => (
  <Tabs>
    <Tabs.Screen
      name="Dashboard"
      options={{
        title: 'Dashboard',
        tabBarIcon: ({ focused }) => {
          return <Home color={focused ? 'red' : 'gray'} size={28} />;
        },
      }}
    />
    <Tabs.Screen
      name="CreateInvoice"
      options={{
        title: 'New Inv',
        tabBarIcon: ({ focused }) => {
          return <FilePlus color={focused ? 'red' : 'gray'} size={28} />;
        },
      }}
    />
    <Tabs.Screen
      name="ShowInvoices"
      options={{
        title: 'Show Inv',
        tabBarIcon: ({ focused }) => {
          return <FileText color={focused ? 'red' : 'gray'} size={28} />;
        },
      }}
    />
  </Tabs>
);

export default UserLayout;
