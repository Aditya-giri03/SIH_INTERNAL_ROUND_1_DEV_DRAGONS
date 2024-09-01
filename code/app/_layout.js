import { useEffect, useState, createContext, useContext } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { Alert } from 'react-native';

// Create a context for user data
const UserContext = createContext(null);

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      // setUserRole('user');

      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        setUserRole(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user === null) {
      // User is not logged in
      router.replace('/(auth)/Login');
    } else if (user && userRole) {
      // User is logged in and we have their role
      const inAuthGroup = segments[0] === '(auth)';
      if (inAuthGroup) {
        // User is in the auth group but shouldn't be, redirect them
        switch (userRole) {
          case 'admin':
            router.replace('/admin');
            break;
          case 'officer':
            router.replace('/officer');
            break;
          case 'user':
            router.replace('/user');
            break;
          default:
            // If we don't recognize the role, log them out
            Alert.alert(
              'Account Verification Failed',
              'Your Account is not verified by the Admin',
              [
                {
                  text: 'Log Out',
                  onPress: () => {
                    auth.signOut();
                    router.replace('/(auth)/Login');
                  },
                  style: 'cancel',
                },
              ]
            );
        }
      }
    }
  }, [user, userRole]);
  console.log('====================================');
  return (
    <UserContext.Provider value={{ user, userRole }}>
      <Slot />
    </UserContext.Provider>
  );
}
