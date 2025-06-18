import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigationState } from '@react-navigation/native';
import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import homeScreenStyle from './styles/HomeScreenStyle';
import HomeScreen from './screens/HomeScreen';
import MenuHomeScreen from './screens/MenuHomeScreen';
import ChatBoxScreen from './screens/ChatBoxScreen';
import FaceAPI from './screens/FaceAPI';
import FaceAPITimer from './navigation/FaceApiTImer';
import WalletScreen from './screens/MenuScreens/walletScreen';
import DriverInfo from './screens/MenuScreens/DriverInfo';
import RideHistoryScreen from './screens/MenuScreens/RideHistoryScreen';
import LogInScreen from './navigation/LoginScreen';
import { DriverProvider } from './context/DriverContext';
import { useRef, useState } from 'react';
import NotificationScreen from './screens/MenuScreens/NotificationScreen';
import IncomeStatisticsScreen from './screens/MenuScreens/InComeStatisticsSreen';

const Stack = createStackNavigator();

export default function App() {
const [currentRoute, setCurrentRoute] = useState<string | undefined>('Login'); // mặc định là Login
  const navigationRef = useRef<any>(null);

  return (
    <DriverProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          const initialRoute = navigationRef.current?.getCurrentRoute()?.name;
          setCurrentRoute(initialRoute);
        }}
        onStateChange={() => {
          const route = navigationRef.current?.getCurrentRoute()?.name;
          setCurrentRoute(route);
        }}
      >
        {/* ✅ Chỉ render FaceAPITimer nếu KHÔNG ở màn hình Login */}
        {currentRoute !== 'Login' && <FaceAPITimer />}

        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LogInScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Menu" component={MenuHomeScreen} />
          <Stack.Screen name="ChatBox" component={ChatBoxScreen} />
          <Stack.Screen name="Face" component={FaceAPI} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="DriverInfo" component={DriverInfo} />
          <Stack.Screen name="RideHistory" component={RideHistoryScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="IncomeStatistics" component={IncomeStatisticsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DriverProvider>
  );
}
