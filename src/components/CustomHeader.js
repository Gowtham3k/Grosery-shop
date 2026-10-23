import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function CustomHeader({
  title,
  showBack = false,
  showDrawer = true,
  onBackPress,
  onDrawerPress,
  rightIcon,
  onRightPress,
  subtitle,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.textDark} />
          </TouchableOpacity>
        ) : showDrawer ? (
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={onDrawerPress}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={22} color={COLORS.textDark} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 42 }} />
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.rightContainer}>
        {rightIcon ? (
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={onRightPress}
            activeOpacity={0.7}
          >
            <Ionicons name={rightIcon} size={20} color={COLORS.textDark} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 42 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      },
    }),
  },
});
