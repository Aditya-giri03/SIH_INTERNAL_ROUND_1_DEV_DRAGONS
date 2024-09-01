import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="Login" options={{ title: 'Login' }} />
      <Stack.Screen name="Register" options={{ title: 'Sign Up' }} />
    </Stack>
  );
}
