import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFeatureGate } from '@statsig/react-bindings';
import Dashboard from '../screens/Dashboard';
import DuelScreen from '../screens/DuelScreen';
import ClassicOnboarding from '../screens/ClassicOnboarding';
import ExpressDuelOnboarding from '../screens/ExpressDuelOnboarding';
import CreateAccount from '../screens/CreateAccount';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  // Statsig decide qué onboarding ve cada usuario — sin nuevo deploy
  const { value: showExpressDuel } = useFeatureGate('onboarding_express_duel');

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerStyle: { backgroundColor: '#0D0D12' },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: '#0D0D12' },
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Onboarding"
          component={showExpressDuel ? ExpressDuelOnboarding : ClassicOnboarding}
        />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Duel" component={DuelScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
