import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
  ScrollView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useShop, DEFAULT_ACCOUNTS } from '../context/ShopContext';

export default function HomeScreen({ navigation }) {
  const { role, setRole, login, signup, loginWithPreset, accounts, validateCredentials } = useShop();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [selectedRole, setSelectedRole] = useState(role || 'customer');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});

  // Floating animations for "fruits la parakura marriii" (Smooth levitation)
  const floatAnimMain = useRef(new Animated.Value(0)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main circular fruit hero floating loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnimMain, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnimMain, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating fruit particle 1 (Strawberry)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: 1,
          duration: 2100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 2100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating fruit particle 2 (Pineapple)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 1,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating fruit particle 3 (Lemon)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim3, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim3, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnimMain, floatAnim1, floatAnim2, floatAnim3]);

  const translateYMain = floatAnimMain.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const translateYFruit1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });

  const translateYFruit2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const translateYFruit3 = floatAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  const validateAuthForm = () => {
    const newErrors = {};

    if (authMode === 'signin') {
      const res = validateCredentials({ email, password, role: selectedRole });
      if (!res.valid) {
        newErrors[res.field] = res.message;
        setErrors(newErrors);
        return false;
      }
      setErrors({});
      return true;
    }

    // Sign up mode validations
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email';
    } else if (accounts && accounts[email.trim().toLowerCase()]) {
      newErrors.email = 'This email is already registered. Please sign in.';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = 'Phone must be a 10-digit number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthSubmit = () => {
    if (!validateAuthForm()) return;

    if (authMode === 'signin') {
      login({ email: email.trim().toLowerCase(), role: selectedRole });
      setRole(selectedRole);
      setAuthModalVisible(false);
      navigation.navigate('MainDrawer');
      return;
    }

    // Sign up mode
    signup({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password,
      role: selectedRole,
    });
    setRole(selectedRole);
    setAuthModalVisible(false);
    navigation.navigate('MainDrawer');
  };

  const handleQuickFill = (roleType) => {
    const acc = DEFAULT_ACCOUNTS[roleType];
    setEmail(acc.email);
    setPassword(acc.password);
    setName(acc.name);
    setPhone(acc.phone);
    setSelectedRole(roleType);
    setErrors({});
  };

  const handleGetStarted = () => {
    setAuthMode('signin');
    setSelectedRole('customer');
    setEmail('');
    setPassword('');
    setErrors({});
    setAuthModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Floating Circle Shape Picture with Flying Floating Fruits ("fruits la parakura marriii") */}
        <View style={styles.heroWrapper}>
          {/* Main Floating Circular Fruit Container */}
          <Animated.View
            style={[
              styles.circleContainer,
              {
                transform: [{ translateY: translateYMain }],
              },
            ]}
          >
            <View style={styles.circleOuterGlow}>
              <View style={styles.circleBorderRing}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
                  }}
                  style={styles.circleImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </Animated.View>

          {/* Flying / Floating Fruit Badge 1 (Strawberry Fresh) */}
          <Animated.View
            style={[
              styles.floatingBadgeLeft,
              { transform: [{ translateY: translateYFruit1 }] },
            ]}
          >
            <Text style={styles.floatingEmoji}>🍓</Text>
            <View>
              <Text style={styles.floatingBadgeTitle}>Fresh Daily</Text>
              <Text style={styles.floatingBadgeSub}>100% Organic</Text>
            </View>
          </Animated.View>

          {/* Flying / Floating Fruit Badge 2 (Pineapple Sweet) */}
          <Animated.View
            style={[
              styles.floatingBadgeRight,
              { transform: [{ translateY: translateYFruit2 }] },
            ]}
          >
            <Text style={styles.floatingEmoji}>🍍</Text>
            <View>
              <Text style={styles.floatingBadgeTitle}>Farm Picked</Text>
              <Text style={styles.floatingBadgeSub}>Juicy & Sweet</Text>
            </View>
          </Animated.View>

          {/* Flying / Floating Fruit Badge 3 (Lemon Detox) */}
          <Animated.View
            style={[
              styles.floatingBadgeBottom,
              { transform: [{ translateY: translateYFruit3 }] },
            ]}
          >
            <Text style={styles.floatingEmoji}>🍋</Text>
            <View>
              <Text style={styles.floatingBadgeTitle}>Natural Vitamin</Text>
              <Text style={styles.floatingBadgeSub}>Super Healthy</Text>
            </View>
          </Animated.View>
        </View>

        {/* Pagination Indicator matching Figma: capsule line + dot */}
        <View style={styles.paginationRow}>
          <View style={styles.paginationLine} />
          <View style={styles.paginationDot} />
        </View>

        {/* Branding & Subtitle matching Figma */}
        <View style={styles.textContainer}>
          <Text style={styles.brandTitle}>Grocery Shop</Text>
          <Text style={styles.brandSubtitle}>
            The easiest way to buy your{'\n'}grocery shopping
          </Text>
        </View>

        {/* Clean Action Section: Get Started + Sign In / Sign Up */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.88}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>

          <View style={styles.authLinksRow}>
            <TouchableOpacity
              style={styles.authLinkButton}
              onPress={() => {
                setAuthMode('signin');
                setSelectedRole('customer');
                setEmail('');
                setPassword('');
                setErrors({});
                setAuthModalVisible(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.authLinkText}>Sign In</Text>
            </TouchableOpacity>

            <Text style={styles.authDividerText}>•</Text>

            <TouchableOpacity
              style={styles.authLinkButton}
              onPress={() => {
                setAuthMode('signup');
                setName('');
                setEmail('');
                setPassword('');
                setPhone('');
                setErrors({});
                setAuthModalVisible(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.authLinkText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Sign In / Sign Up Modal with Default Mock Data & Inline Validation */}
      <Modal
        visible={authModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAuthModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {authMode === 'signin' ? 'Sign In to Grocery Shop' : 'Create an Account'}
              </Text>
              <TouchableOpacity
                onPress={() => setAuthModalVisible(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Role Selection: Clicking Customer opens Customer page, clicking Admin opens Admin page */}
              <View style={styles.modalRoleSelector}>
                <Text style={styles.inputLabel}>Select Your Role:</Text>
                <View style={styles.roleButtonsRow}>
                  <TouchableOpacity
                    style={[
                      styles.modalRoleBtn,
                      selectedRole === 'customer' && styles.modalRoleBtnActive,
                    ]}
                    onPress={() => {
                      setSelectedRole('customer');
                      setErrors({});
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="person"
                      size={18}
                      color={selectedRole === 'customer' ? COLORS.white : COLORS.textDark}
                    />
                    <Text
                      style={[
                        styles.modalRoleBtnText,
                        selectedRole === 'customer' && styles.modalRoleBtnTextActive,
                      ]}
                    >
                      Customer
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modalRoleBtn,
                      selectedRole === 'admin' && styles.modalRoleBtnActive,
                    ]}
                    onPress={() => {
                      setSelectedRole('admin');
                      setErrors({});
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={18}
                      color={selectedRole === 'admin' ? COLORS.white : COLORS.textDark}
                    />
                    <Text
                      style={[
                        styles.modalRoleBtnText,
                        selectedRole === 'admin' && styles.modalRoleBtnTextActive,
                      ]}
                    >
                      Admin
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Authorized Credentials Guide & Auto-Fill for Testing */}
              {authMode === 'signin' && (
                <View
                  style={[
                    styles.authNoticeBox,
                    selectedRole === 'admin' && styles.authNoticeBoxAdmin,
                  ]}
                >
                  <View style={styles.authNoticeContent}>
                    <Ionicons
                      name={selectedRole === 'admin' ? 'shield-checkmark' : 'person'}
                      size={20}
                      color={selectedRole === 'admin' ? COLORS.accentOrange : COLORS.primary}
                    />
                    <View style={styles.authNoticeTextCol}>
                      <Text style={styles.authNoticeTitle}>
                        {selectedRole === 'admin' ? 'Authorized Admin ID' : 'Authorized Customer ID'}
                      </Text>
                      <Text style={styles.authNoticeEmail}>
                        {selectedRole === 'admin'
                          ? 'admin@grocery.com  (pass: admin123)'
                          : 'customer@grocery.com  (pass: password123)'}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.quickFillPill,
                      selectedRole === 'admin' && styles.quickFillPillAdmin,
                    ]}
                    onPress={() => handleQuickFill(selectedRole)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.quickFillPillText}>Auto Fill</Text>
                  </TouchableOpacity>
                </View>
              )}

              {authMode === 'signup' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name *</Text>
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="Enter full name"
                    placeholderTextColor="#A0A0A0"
                    value={name}
                    onChangeText={(txt) => {
                      setName(txt);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                    }}
                  />
                  {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder={selectedRole === 'admin' ? 'admin@grocery.com' : 'customer@grocery.com'}
                  placeholderTextColor="#A0A0A0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(txt) => {
                    setEmail(txt);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  }}
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>

              {authMode === 'signup' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number *</Text>
                  <TextInput
                    style={[styles.input, errors.phone && styles.inputError]}
                    placeholder="10-digit mobile number"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={(txt) => {
                      setPhone(txt);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                    }}
                  />
                  {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password *</Text>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder={selectedRole === 'admin' ? 'admin123' : 'password123'}
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry
                  value={password}
                  onChangeText={(txt) => {
                    setPassword(txt);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                />
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>

              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleAuthSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSubmitBtnText}>
                  {authMode === 'signin' ? `Sign In as ${selectedRole.toUpperCase()}` : 'Register & Enter App'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toggleAuthModeBtn}
                onPress={() => {
                  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                  setErrors({});
                }}
              >
                <Text style={styles.toggleAuthModeText}>
                  {authMode === 'signin'
                    ? "Don't have an account? Sign Up"
                    : 'Already have an account? Sign In'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  heroWrapper: {
    width: '100%',
    height: 380,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 6,
    marginBottom: 16,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleOuterGlow: {
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0D9488',
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.25,
        shadowRadius: 26,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 18px 42px rgba(13, 148, 136, 0.25)',
      },
    }),
  },
  circleBorderRing: {
    width: 310,
    height: 310,
    borderRadius: 155,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: COLORS.white,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  circleImage: {
    width: '94%',
    height: '94%',
    borderRadius: 150,
  },
  // Floating badges ("fruits la parakura marriii")
  floatingBadgeLeft: {
    position: 'absolute',
    top: 30,
    left: -6,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 22,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 8 },
      android: { elevation: 5 },
      web: {
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
        cursor: 'default',
      },
    }),
  },
  floatingBadgeRight: {
    position: 'absolute',
    top: 90,
    right: -6,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 22,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 8 },
      android: { elevation: 5 },
      web: {
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
        cursor: 'default',
      },
    }),
  },
  floatingBadgeBottom: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 22,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 8 },
      android: { elevation: 5 },
      web: {
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
        cursor: 'default',
      },
    }),
  },
  floatingEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  floatingBadgeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  floatingBadgeSub: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  paginationLine: {
    width: 28,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textDark,
    marginRight: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.inactivePill,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.textDark,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 23,
    fontWeight: '500',
  },
  actionContainer: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    marginBottom: 16,
  },
  getStartedButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 4 },
      web: {
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(13, 148, 136, 0.35)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
      },
    }),
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  authLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  authLinkButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  authLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    textDecorationLine: 'underline',
  },
  authDividerText: {
    color: COLORS.textLight,
    marginHorizontal: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  closeBtn: {
    padding: 4,
  },
  defaultCredentialsBox: {
    backgroundColor: '#F0FAF8',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  defaultCredsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginLeft: 6,
  },
  defaultCredsText: {
    fontSize: 12,
    color: COLORS.textDark,
    marginTop: 2,
  },
  quickFillPillsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  fillPill: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#B2DFDB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  fillPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  modalRoleSelector: {
    marginBottom: 12,
  },
  roleButtonsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  modalRoleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginRight: 8,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  modalRoleBtnActive: {
    backgroundColor: COLORS.primary,
  },
  modalRoleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginLeft: 6,
  },
  modalRoleBtnTextActive: {
    color: COLORS.white,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: COLORS.textDark,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
  modalSubmitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  modalSubmitBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  toggleAuthModeBtn: {
    marginTop: 14,
    alignItems: 'center',
  },
  toggleAuthModeText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  authNoticeBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authNoticeBoxAdmin: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
  },
  authNoticeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  authNoticeTextCol: {
    marginLeft: 8,
    flex: 1,
  },
  authNoticeTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  authNoticeEmail: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
    marginTop: 2,
  },
  quickFillPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  quickFillPillAdmin: {
    backgroundColor: COLORS.accentOrange,
  },
  quickFillPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
});
