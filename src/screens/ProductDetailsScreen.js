import React, { useState } from 'react';
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

export default function ProductDetailsScreen({ route, navigation }) {
  const { product: initialProduct } = route.params;
  const { isFavorite, toggleFavorite, addToCart, products, role, setRole } = useShop();

  // Always bind to latest reactive state in products
  const product = products.find((p) => p.id === initialProduct.id) || initialProduct;
  const currentStock = product.stockCount !== undefined ? product.stockCount : 15;
  const isAvailable = product.inStock && currentStock > 0;

  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const favorited = isFavorite(product.id);

  // Find related items (same category first, excluding current product, with fallbacks)
  const sameCategory = products.filter((p) => p.category === product.category && p.id !== product.id);
  const otherItems = products.filter((p) => p.category !== product.category && p.id !== product.id);
  const relatedItems = [...sameCategory, ...otherItems].slice(0, 6);

  const handleIncrement = () => {
    if (quantity < currentStock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (isAvailable) {
      addToCart(product, quantity);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2200);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header matching Figma: Back circle, "Details", Heart circle */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Details</Text>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => toggleFavorite(product.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={22}
            color={favorited ? COLORS.accentRed : COLORS.textDark}
          />
        </TouchableOpacity>
      </View>

      {/* Part 1 Point 5 Rule Banner: Product's Details Screen (Only Customer) */}
      {role === 'admin' && (
        <View style={styles.roleBanner}>
          <Ionicons name="information-circle" size={16} color={COLORS.accentOrange} />
          <Text style={styles.roleBannerText}>
            Point 5: Details Screen is for <Text style={{ fontWeight: '800' }}>Customer</Text>. Currently viewing as Admin.
          </Text>
          <TouchableOpacity
            style={styles.switchRolePill}
            onPress={() => setRole('customer')}
          >
            <Text style={styles.switchRolePillText}>Switch to Customer</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Large Central Product Image Card with Pristine Centered Frame */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: product.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Image Pagination Dots matching Figma: • • • */}
        <View style={styles.paginationDots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Product Title, Rating, and Quantity Selector Row matching Figma */}
        <View style={styles.titleRow}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.productName}>{product.fullName || product.name}</Text>
            {/* 5-Star Rating & Live Stock Badge */}
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={15}
                  color={COLORS.starGold}
                  style={{ marginRight: 2 }}
                />
              ))}
              <Text style={styles.ratingText}>
                {product.rating} ({product.reviewsCount} reviews)
              </Text>
            </View>

            {/* Dynamic Total Price + Per Unit / Per Bottle Price Display */}
            <View style={styles.priceRow}>
              <Text style={styles.dynamicPriceText}>
                Rs {product.price * quantity}
              </Text>
              <View style={styles.perUnitPill}>
                <Text style={styles.perUnitPillText}>
                  per {product.unit || 'bottle'}: Rs {product.price}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 6 }}>
              <View
                style={[
                  styles.stockBadge,
                  !isAvailable
                    ? styles.stockBadgeOut
                    : currentStock <= 3
                    ? styles.stockBadgeLow
                    : styles.stockBadgeIn,
                ]}
              >
                <Text
                  style={[
                    styles.stockBadgeText,
                    !isAvailable
                      ? styles.stockBadgeTextOut
                      : currentStock <= 3
                      ? styles.stockBadgeTextLow
                      : styles.stockBadgeTextIn,
                  ]}
                >
                  {isAvailable ? `📦 ${currentStock} available in stock` : '❌ Out of Stock'}
                </Text>
              </View>
            </View>
          </View>

          {/* Stepper Pill matching Figma: - 2kg + */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepperPill}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={handleDecrement}
                activeOpacity={0.7}
              >
                <Text style={styles.stepperSign}>-</Text>
              </TouchableOpacity>

              <Text style={styles.stepperValue}>
                {quantity} {product.unit}
              </Text>

              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={handleIncrement}
                activeOpacity={0.7}
              >
                <Text style={styles.stepperSign}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.stepperSubtext}>Change qty</Text>
          </View>
        </View>

        {/* Section: Description with Expandable See More */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text
            style={styles.descriptionText}
            numberOfLines={isExpanded ? undefined : 3}
          >
            {product.description}
          </Text>
          <TouchableOpacity
            onPress={() => setIsExpanded(!isExpanded)}
            style={{ marginTop: 4, alignSelf: 'flex-start' }}
          >
            <Text style={styles.seeMoreText}>
              {isExpanded ? 'See less' : '....See more'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section: Related Items with BIG Images */}
        <View style={styles.section}>
          <View style={styles.relatedHeaderRow}>
            <Text style={styles.sectionTitle}>Related Items</Text>
            <Text style={styles.relatedCountText}>({relatedItems.length} items)</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedScrollContent}
            style={styles.relatedScroll}
          >
            {relatedItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.relatedCard}
                onPress={() => navigation.push('ProductDetails', { product: item })}
                activeOpacity={0.8}
              >
                <View style={styles.relatedImgWrapper}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.relatedImage}
                    resizeMode="cover"
                  />
                  <View style={styles.relatedUnitBadge}>
                    <Text style={styles.relatedUnitBadgeText}>per {item.unit}</Text>
                  </View>
                </View>
                <View style={styles.relatedInfo}>
                  <Text style={styles.relatedName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.relatedPriceRow}>
                    <Text style={styles.relatedPrice}>Rs {item.price}</Text>
                    <View style={styles.relatedRating}>
                      <Ionicons name="star" size={12} color={COLORS.starGold} />
                      <Text style={styles.relatedRatingText}>{item.rating}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Added notice pill */}
        {addedNotice && (
          <View style={styles.toastNotice}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.white} />
            <Text style={styles.toastNoticeText}>
              Added {quantity} {product.unit} of {product.name} to Cart!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Bar matching Figma: Price on left, "Add to Cart >>>" on right */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total ({quantity} {product.unit})</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <Text style={styles.priceValue}>
              Rs {product.price * quantity}
            </Text>
            <Text style={styles.unitPriceText}>
              {' '}(per {product.unit || 'bottle'}: Rs {product.price})
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.addToCartBtn, !isAvailable && styles.addToCartBtnDisabled]}
          onPress={handleAddToCart}
          disabled={!isAvailable}
          activeOpacity={0.85}
        >
          <Text style={styles.addToCartText}>
            {isAvailable ? 'Add to Cart >>>' : 'Sold Out'}
          </Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 6,
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
    paddingHorizontal: 20,
    paddingBottom: 110,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  imageCard: {
    width: '100%',
    height: 320,
    backgroundColor: '#F0FAF8',
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 8,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 3 },
      web: { boxShadow: '0 4px 16px rgba(13, 148, 136, 0.08)' },
    }),
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  stockBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
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
  stockBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  stockBadgeTextIn: {
    color: COLORS.primaryDark,
  },
  stockBadgeTextLow: {
    color: '#D84315',
  },
  stockBadgeTextOut: {
    color: COLORS.accentRed,
  },
  addToCartBtnDisabled: {
    backgroundColor: '#A0A0A0',
    ...Platform.select({
      web: { cursor: 'not-allowed', boxShadow: 'none' },
    }),
  },
  paginationDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#B2DFDB',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 4,
    gap: 8,
  },
  dynamicPriceText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  perUnitPill: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B2DFDB',
  },
  perUnitPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  stepperContainer: {
    alignItems: 'center',
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 6,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(13, 148, 136, 0.35)',
      },
    }),
  },
  stepperBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  stepperSign: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.white,
    lineHeight: 22,
  },
  stepperValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
    marginHorizontal: 10,
  },
  stepperSubtext: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '600',
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 21,
    marginTop: 6,
  },
  seeMoreText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  relatedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  relatedCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  relatedScroll: {
    marginTop: 4,
  },
  relatedScrollContent: {
    paddingVertical: 6,
    paddingRight: 10,
  },
  relatedCard: {
    width: 175,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 10,
    marginRight: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 6 },
      android: { elevation: 3 },
      web: {
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(13, 148, 136, 0.1)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
      },
    }),
  },
  relatedImgWrapper: {
    width: '100%',
    height: 150,
    borderRadius: 16,
    backgroundColor: '#F0FAF8',
    overflow: 'hidden',
    position: 'relative',
  },
  relatedImage: {
    width: '100%',
    height: '100%',
  },
  relatedUnitBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.2)',
  },
  relatedUnitBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  relatedInfo: {
    marginTop: 10,
    width: '100%',
  },
  relatedName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  relatedPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  relatedPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  relatedRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relatedRatingText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginLeft: 3,
  },
  toastNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentGreen,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 18,
    alignSelf: 'center',
  },
  toastNoticeText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  priceContainer: {
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  unitPriceText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginTop: 1,
  },
  addToCartBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6 },
      android: { elevation: 3 },
      web: {
        cursor: 'pointer',
        boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
        transition: 'transform 0.15s ease',
      },
    }),
  },
  addToCartText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
});
