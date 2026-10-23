import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useShop } from '../context/ShopContext';

export default function CustomDrawerContent(props) {
  const { navigation } = props;
  const { user, role, setRole, cartItemCount, favoriteProducts, logout } = useShop();



  const menuItems = [
    {
      label: 'Home (Sign In / Sign Up)',
      icon: 'home-outline',
      action: () => {
        navigation.closeDrawer();
        navigation.navigate('Home');
      },
    },
    {
      label: 'Daily Grocery Products',
      icon: 'storefront-outline',
      targetTab: 'ProductsTab',
    },
    {
      label: 'My Favourites',
      icon: 'heart-outline',
      targetTab: 'FavouriteTab',
      badge: favoriteProducts.length > 0 ? favoriteProducts.length : null,
    },
    {
      label: 'My Cart',
      icon: 'cart-outline',
      targetTab: 'MyCartTab',
      badge: cartItemCount > 0 ? cartItemCount : null,
    },
    {
      label: 'My Profile',
      icon: 'person-outline',
      targetTab: 'ProfileTab',
    },
  ];

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        {/* Drawer Header with User Profile and Role Badge */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
              }}
              style={styles.avatar}
            />
            <View
              style={[
                styles.roleDot,
                { backgroundColor: role === 'admin' ? COLORS.accentOrange : COLORS.accentGreen },
              ]}
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user.email}
            </Text>
            <View
              style={[
                styles.roleBadge,
                { backgroundColor: role === 'admin' ? '#FFF3E0' : COLORS.primaryLight },
              ]}
            >
              <Text
                style={[
                  styles.roleBadgeText,
                  { color: role === 'admin' ? COLORS.accentOrange : COLORS.primaryDark },
                ]}
              >
                Role: {role.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Main Tab Navigations */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Main Navigation</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                if (item.action) {
                  item.action();
                } else {
                  navigation.navigate('MainTabs', { screen: item.targetTab });
                  navigation.closeDrawer();
                }
              }}
            >
              <Ionicons name={item.icon} size={22} color={COLORS.textDark} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.badge !== null && item.badge !== undefined && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Extra Direct Stack Actions */}
        <View style={styles.divider} />
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('EditProfile');
              navigation.closeDrawer();
            }}
          >
            <Ionicons name="create-outline" size={22} color={COLORS.textDark} />
            <Text style={styles.menuLabel}>Edit Profile & Address</Text>
          </TouchableOpacity>

          {role === 'admin' && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('AdminManagement');
                navigation.closeDrawer();
              }}
            >
              <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.accentOrange} />
              <Text style={[styles.menuLabel, { color: COLORS.accentOrange, fontWeight: '700' }]}>
                Admin Inventory Manager
              </Text>
            </TouchableOpacity>
          )}

        </View>
      </DrawerContentScrollView>

      {/* Drawer Footer: Exit / Sign Out */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Home');
          }}
        >
          <Ionicons name="exit-outline" size={20} color={COLORS.accentRed} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
  },
  roleDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  headerInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  menuSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: COLORS.textLight,
    marginBottom: 10,
    letterSpacing: 0.8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    marginLeft: 14,
    flex: 1,
  },
  badgeContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accentRed,
    marginLeft: 10,
  },
});
