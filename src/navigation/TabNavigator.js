import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useShop } from '../context/ShopContext';

import ProductsListScreen from '../screens/ProductsListScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';

import AdminManagementScreen from '../screens/AdminManagementScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { role, cartItemCount, favoriteProducts } = useShop();

  // Admin View: Only Product List, Home, and Profile tabs
  if (role === 'admin') {
    return (
      <Tab.Navigator
        initialRouteName="AdminProductsTab"
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: true,
          tabBarActiveTintColor: COLORS.accentOrange,
          tabBarInactiveTintColor: COLORS.tabInactive,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={AdminManagementScreen}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('Home');
            },
          })}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                <Ionicons
                  name={focused ? 'home' : 'home-outline'}
                  size={22}
                  color={color}
                />
                {focused && <View style={[styles.activeDot, { backgroundColor: COLORS.accentOrange }]} />}
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="AdminProductsTab"
          component={AdminManagementScreen}
          options={{
            tabBarLabel: 'Product List',
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                <Ionicons
                  name={focused ? 'list' : 'list-outline'}
                  size={22}
                  color={color}
                />
                {focused && <View style={[styles.activeDot, { backgroundColor: COLORS.accentOrange }]} />}
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="ProfileTab"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                <Ionicons
                  name={focused ? 'person' : 'person-outline'}
                  size={22}
                  color={color}
                />
                {focused && <View style={[styles.activeDot, { backgroundColor: COLORS.accentOrange }]} />}
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  // Customer View: Full complete shopping tabs (Home, Products, Favourite, Cart, Profile)
  return (
    <Tab.Navigator
      initialRouteName="ProductsTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.tabInactive,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={ProductsListScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Home');
          },
        })}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={22}
                color={color}
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="ProductsTab"
        component={ProductsListScreen}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? 'storefront' : 'storefront-outline'}
                size={22}
                color={color}
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="FavouriteTab"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favourite',
          tabBarBadge: favoriteProducts.length > 0 ? favoriteProducts.length : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? 'heart' : 'heart-outline'}
                size={22}
                color={color}
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="MyCartTab"
        component={CartScreen}
        options={{
          tabBarLabel: 'My Cart',
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? 'cart' : 'cart-outline'}
                size={22}
                color={color}
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={22}
                color={color}
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.tabBarBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#0D9488',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -4px 16px rgba(13, 148, 136, 0.08)',
      },
    }),
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: COLORS.accentRed,
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    lineHeight: 16,
  },
});
