import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useShop } from '../context/ShopContext';

export default function ProfileScreen({ navigation }) {
  const { user, role, setRole, cartItemCount, favoriteProducts } = useShop();

  const handleRoleToggle = () => {
    const nextRole = role === 'admin' ? 'customer' : 'admin';
    setRole(nextRole);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.openDrawer();
            }
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={22} color={COLORS.textDark} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
              }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editAvatarBadge}
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={14} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => navigation.navigate('MyCartTab')}
            activeOpacity={0.8}
          >
            <Ionicons name="cart" size={22} color={COLORS.primary} />
            <Text style={styles.statCount}>{cartItemCount}</Text>
            <Text style={styles.statLabel}>In Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => navigation.navigate('FavouriteTab')}
            activeOpacity={0.8}
          >
            <Ionicons name="heart" size={22} color={COLORS.accentRed} />
            <Text style={styles.statCount}>{favoriteProducts.length}</Text>
            <Text style={styles.statLabel}>Favourites</Text>
          </TouchableOpacity>

          <View style={styles.statBox}>
            <Ionicons name="receipt" size={22} color={COLORS.accentGreen} />
            <Text style={styles.statCount}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>

        {/* User Details Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionHeader}>Customer Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBg}>
              <Ionicons name="call-outline" size={18} color={COLORS.textDark} />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoTitle}>Phone Number</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBg}>
              <Ionicons name="location-outline" size={18} color={COLORS.textDark} />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoTitle}>Delivery Address</Text>
              <Text style={styles.infoValue}>{user.address}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBg}>
              <Ionicons name="time-outline" size={18} color={COLORS.textDark} />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoTitle}>Preferred Delivery Slot</Text>
              <Text style={styles.infoValue}>{user.preferredSlot}</Text>
            </View>
          </View>
        </View>

        {/* Actions & Role specific views */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryActionBtn}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.85}
          >
            <Ionicons name="create-outline" size={18} color={COLORS.white} />
            <Text style={styles.primaryActionText}>Edit Profile & Address</Text>
          </TouchableOpacity>

          {role === 'admin' && (
            <TouchableOpacity
              style={styles.adminActionBtn}
              onPress={() => navigation.navigate('AdminManagement')}
              activeOpacity={0.85}
            >
              <Ionicons name="shield-checkmark" size={18} color={COLORS.white} />
              <Text style={styles.adminActionText}>Admin Inventory & Stock Manager</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              navigation.navigate('Home');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={18} color={COLORS.accentRed} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.06)', cursor: 'pointer' },
    }),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  roleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  roleBannerText: {
    fontSize: 11,
    color: COLORS.textDark,
    flex: 1,
    marginLeft: 6,
  },
  switchRolePill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  switchRolePillText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  profileCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginTop: 6,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 3 },
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.06)' },
    }),
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  email: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 10,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  roleText: {
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'transform 0.15s ease',
      },
    }),
  },
  statCount: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textDark,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  infoSection: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 18,
    marginTop: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    }),
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  infoIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginTop: 2,
  },
  actionButtons: {
    marginTop: 18,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        boxShadow: '0 3px 10px rgba(13, 148, 136, 0.35)',
        transition: 'transform 0.15s ease',
      },
    }),
  },
  primaryActionText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 8,
  },
  adminActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accentOrange,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 10,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  adminActionText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
    ...Platform.select({
      web: { cursor: 'pointer', transition: 'all 0.15s ease' },
    }),
  },
  switchRoleText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginLeft: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accentRed,
    marginLeft: 8,
  },
});
