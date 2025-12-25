import { NavigationContainer } from '@react-navigation/native';
import { useContext } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from '../contexts/AuthContext';

import AuthScreen from './AuthScreen';
import DrawerNavigator from './DrawerNavigation';

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Login: 'login',
      Signup: 'signup',
      ForgotPassword: 'forgot-password',
      ResetPassword: {
        path: 'reset-password',
        parse: {
          token: (token: string) => token,
        },
      },
    },
  },
};

export default function AppNavigator() {
  const { token, loading } = useContext(AuthContext);

  // Don't render navigation until auth state is resolved to avoid
  // flickering between Auth and App stacks when a token exists.
  if (loading) return null;

  return (
    <NavigationContainer linking={linking}>
      {token ? (
        <View style={{ flex: 1, backgroundColor: '#E9F9FA' }}>
          <StatusBar
            style="dark"
            backgroundColor="#E9F9FA"
            translucent={false}
          />
          <DrawerNavigator />
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <StatusBar
            style="dark"
            backgroundColor="#ffffff"
            translucent={false}
          />
          <AuthScreen />
        </View>
      )}
    </NavigationContainer>
  );
}
