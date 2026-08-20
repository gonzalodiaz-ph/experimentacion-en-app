import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { StatsigProvider } from '@statsig/react-bindings';
import { StatsigClient } from '@statsig/js-client';
import { STATSIG_CLIENT_KEY } from './src/config/statsig';
import AppNavigator from './src/navigation/AppNavigator';

const statsigClient = new StatsigClient(
  STATSIG_CLIENT_KEY,
  { userID: `user_${Math.random().toString(36).substring(2, 8)}` }
);

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    statsigClient.initializeAsync().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d0d1a' }}>
        <ActivityIndicator size="large" color="#00CC66" />
      </View>
    );
  }

  return (
    <StatsigProvider client={statsigClient}>
      <StatusBar style="light" />
      <AppNavigator />
    </StatsigProvider>
  );
}
