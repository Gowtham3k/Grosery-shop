import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DrawerNavigator from './DrawerNavigator';
import EditProfileScreen from '../screens/EditProfileScreen';
import AdminManagementScreen from '../screens/AdminManagementScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="AdminManagement" component={AdminManagementScreen} />
    </Stack.Navigator>
  );
}
