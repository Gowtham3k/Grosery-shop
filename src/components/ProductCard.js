import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useShop } from '../context/ShopContext';

export default function ProductCard({
  product,
  onPress,
  showAddToCart = true,
  showRemoveFavorite = false,
  onRemoveFavorite,
}) {
  const { isFavorite, toggleFavorite, addToCart, role, toggleProductStock, products } = useShop();

  // Retrieve current reactive product state from context
  const liveProduct = products.find((p) => p.id === product.id) || product;
  const currentStock = liveProduct.stockCount !== undefined ? liveProduct.stockCount : 15;
  const isAvailable = liveProduct.inStock && currentStock > 0;

  const favorited = isFavorite(product.id);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoritePress = (e) => {
    e?.stopPropagation?.();
    if (showRemoveFavorite && onRemoveFavorite) {
      onRemoveFavorite();
    } else {
      toggleFavorite(product.id);
    }
  };

  const handleAddToCartPress = (e) => {
    e?.stopPropagation?.();
    if (isAvailable) {
      addToCart(liveProduct, 1);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={[
        styles.card,
        isHovered && styles.cardHovered,
        !isAvailable && styles.outOfStockCard,
      ]}
    >
      {/* Top action row: Stock status badge & Favorite Heart */}
      <View style={styles.topRow}>
        {!isAvailable ? (
          <View style={[styles.stockBadge, styles.stockBadgeOut]}>
            <Text style={styles.stockBadgeTextOut}>Out of Stock</Text>
          </View>
        ) : currentStock <= 3 ? (
          <View style={[styles.stockBadge, styles.stockBadgeLow]}>
            <Text style={styles.stockBadgeTextLow}>Only {currentStock} left</Text>
          </View>
        ) : (
          <View style={[styles.stockBadge, styles.stockBadgeIn]}>
            <Text style={styles.stockBadgeTextIn}>{currentStock} in stock</Text>
          </View>
        )}

        {role !== 'admin' && (
          <TouchableOpacity
            style={[styles.favoriteButton, favorited && styles.favoriteButtonActive]}
            onPress={handleFavoritePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={18}
              color={favorited ? COLORS.accentRed : COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Large Full Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: liveProduct.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Product Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {liveProduct.name}
        </Text>
        <Text style={styles.price}>
          Rs {liveProduct.price}/{liveProduct.unit}
        </Text>
      </View>

      {/* Bottom Actions: Admin Stock Toggle OR Customer Add to Cart */}
      <View style={styles.bottomRow}>
        {role === 'admin' ? (
          <TouchableOpacity
            style={[
              styles.adminStockBtn,
              { backgroundColor: isAvailable ? '#E8F5E9' : '#FFEBEE' },
            ]}
            onPress={(e) => {
              e?.stopPropagation?.();
              toggleProductStock(product.id);
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.adminStockBtnText,
                { color: isAvailable ? COLORS.accentGreen : COLORS.accentRed },
              ]}
            >
              {isAvailable ? `${currentStock} In Stock (Toggle)` : 'Sold Out (Toggle)'}
            </Text>
          </TouchableOpacity>
        ) : (
          showAddToCart && (
            <TouchableOpacity
              style={[styles.addButton, !isAvailable && styles.addButtonDisabled]}
              onPress={handleAddToCartPress}
              disabled={!isAvailable}
              activeOpacity={0.75}
            >
              <Ionicons
                name={isAvailable ? 'add' : 'ban'}
                size={18}
                color={COLORS.white}
              />
            </TouchableOpacity>
          )
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 22,
    padding: 10,
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 6,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
      },
    }),
  },
  cardHovered: {
    ...Platform.select({
      web: {
        transform: [{ translateY: -4 }, { scale: 1.02 }],
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      },
    }),
  },
  outOfStockCard: {
    opacity: 0.72,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    zIndex: 2,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  stockBadgeIn: {
    backgroundColor: COLORS.primaryLight,
  },
  stockBadgeLow: {
    backgroundColor: '#FFF3E0',
  },
  stockBadgeOut: {
    backgroundColor: '#FFEAEA',
  },
  stockBadgeTextIn: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  stockBadgeTextLow: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D84315',
  },
  stockBadgeTextOut: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accentRed,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FAF8',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { cursor: 'pointer', transition: 'transform 0.15s ease' },
    }),
  },
  favoriteButtonActive: {
    backgroundColor: '#FFEBEE',
  },
  imageContainer: {
    width: '100%',
    height: 175,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FAF8',
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    marginTop: 10,
    paddingHorizontal: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  price: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 2,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(203, 176, 50, 0.4)',
        transition: 'transform 0.15s ease',
      },
    }),
  },
  addButtonDisabled: {
    backgroundColor: '#C5C5C5',
    ...Platform.select({
      web: {
        cursor: 'not-allowed',
        boxShadow: 'none',
      },
    }),
  },
  adminStockBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  adminStockBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
