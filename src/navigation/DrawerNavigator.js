import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import CustomDrawerContent from '../components/CustomDrawerContent';
import EditProfileScreen from '../screens/EditProfileScreen';
import AdminManagementScreen from '../screens/AdminManagementScreen';
import { COLORS } from '../theme/colors';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: COLORS.backgroundLight,
          width: 300,
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ drawerLabel: 'Home' }}
      />
      <Drawer.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ drawerLabel: 'Edit Profile' }}
      />
      <Drawer.Screen
        name="AdminManagement"
        component={AdminManagementScreen}
        options={{ drawerLabel: 'Admin Manager' }}
      />
    </Drawer.Navigator>
  );
}
