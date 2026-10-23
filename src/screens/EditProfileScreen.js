import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useShop } from '../context/ShopContext';

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile, role, setRole } = useShop();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [preferredSlot, setPreferredSlot] = useState(user.preferredSlot);
  const [selectedRole, setSelectedRole] = useState(user.role);

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const slots = [
    'Morning (8:00 AM - 11:00 AM)',
    'Afternoon (1:00 PM - 4:00 PM)',
    'Evening (5:00 PM - 8:00 PM)',
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.trim().replace(/[-()\s]/g, ''))) {
      newErrors.phone = 'Phone number must be a valid 10-digit number';
    }

    if (!address.trim()) {
      newErrors.address = 'Delivery address is required';
    } else if (address.trim().length < 6) {
      newErrors.address = 'Please provide a complete delivery address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      preferredSlot,
      role: selectedRole,
    });
    setRole(selectedRole);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      navigation.goBack();
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Profile</Text>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark" size={22} color={COLORS.primaryDark} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {saveSuccess && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
            <Text style={styles.successBannerText}>Customer profile updated successfully!</Text>
          </View>
        )}

        {/* Input: Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <View style={[styles.inputWrapper, errors.name && styles.inputWrapperError]}>
            <Ionicons name="person-outline" size={18} color={COLORS.textLight} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Sarah Jenkins"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        {/* Input: Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <View style={[styles.inputWrapper, errors.email && styles.inputWrapperError]}>
            <Ionicons name="mail-outline" size={18} color={COLORS.textLight} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="e.g. sarah@example.com"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        {/* Input: Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <View style={[styles.inputWrapper, errors.phone && styles.inputWrapperError]}>
            <Ionicons name="call-outline" size={18} color={COLORS.textLight} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="10-digit mobile number"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
        </View>

        {/* Input: Delivery Address */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Delivery Address *</Text>
          <View
            style={[
              styles.inputWrapper,
              styles.textAreaWrapper,
              errors.address && styles.inputWrapperError,
            ]}
          >
            <Ionicons
              name="location-outline"
              size={18}
              color={COLORS.textLight}
              style={[styles.icon, { marginTop: 12 }]}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              placeholder="Complete street address, apartment, and city"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
        </View>

        {/* Select Preferred Delivery Slot */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preferred Delivery Slot</Text>
          {slots.map((slot) => {
            const isSelected = preferredSlot === slot;
            return (
              <TouchableOpacity
                key={slot}
                style={[styles.slotOption, isSelected && styles.slotOptionActive]}
                onPress={() => setPreferredSlot(slot)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color={isSelected ? COLORS.primaryDark : COLORS.textLight}
                />
                <Text style={[styles.slotText, isSelected && styles.slotTextActive]}>{slot}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Role Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Account Role Access</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, selectedRole === 'customer' && styles.roleBtnActive]}
              onPress={() => setSelectedRole('customer')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person"
                size={16}
                color={selectedRole === 'customer' ? COLORS.white : COLORS.textDark}
              />
              <Text style={[styles.roleBtnText, selectedRole === 'customer' && styles.roleBtnTextActive]}>
                Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, selectedRole === 'admin' && styles.roleBtnActive]}
              onPress={() => setSelectedRole('admin')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="shield-checkmark"
                size={16}
                color={selectedRole === 'admin' ? COLORS.white : COLORS.textDark}
              />
              <Text style={[styles.roleBtnText, selectedRole === 'admin' && styles.roleBtnTextActive]}>
                Admin
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Buttons */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>Save Profile Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentGreen,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  successBannerText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8D5',
    paddingHorizontal: 12,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    height: 84,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textDark,
    paddingVertical: 12,
  },
  textArea: {
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
  slotOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8D5',
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  slotOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FAF7E6',
  },
  slotText: {
    fontSize: 14,
    color: COLORS.textDark,
    marginLeft: 10,
    fontWeight: '500',
  },
  slotTextActive: {
    fontWeight: '700',
    color: COLORS.textDark,
  },
  roleRow: {
    flexDirection: 'row',
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8D5',
    marginRight: 8,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  roleBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginLeft: 6,
  },
  roleBtnTextActive: {
    color: COLORS.white,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    ...Platform.select({
      ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 3 },
      web: {
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(13, 148, 136, 0.35)',
        transition: 'transform 0.15s ease',
      },
    }),
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});
