import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useShop } from '../context/ShopContext';

export default function CartScreen({ navigation }) {
  const {
    cart,
    products,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    cartTotal,
    user,
    role,
  } = useShop();

  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const handleBookNow = () => {
    if (cart.length === 0) return;
    setOrderConfirmed(false);
    setCheckoutModalVisible(true);
  };

  const handleConfirmOrder = () => {
    setOrderConfirmed(true);
    setTimeout(() => {
      clearCart();
      setCheckoutModalVisible(false);
      setOrderConfirmed(false);
    }, 2500);
  };

  const renderCartItem = ({ item }) => {
    const { product, quantity } = item;
    const itemTotal = product.price * quantity;
    const liveProd = products.find((p) => p.id === product.id) || product;
    const stockLeft = liveProd.stockCount ?? 0;

    return (
      <View style={styles.cartCard}>
        {/* Large Square Product Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        {/* Product Details */}
        <View style={styles.detailsCol}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productCategory}>
            {product.category} • <Text style={{ color: stockLeft > 0 ? '#557A1E' : COLORS.accentRed, fontWeight: '700' }}>{stockLeft > 0 ? `${stockLeft} left` : 'Out of stock'}</Text>
          </Text>
          <Text style={styles.productPrice}>
            Rs {product.price}/{product.unit}
          </Text>
          <Text style={styles.itemTotal}>Subtotal: Rs {itemTotal}</Text>
        </View>

        {/* Stepper & Individual Delete Option */}
        <View style={styles.rightActionsCol}>
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={[styles.stepperBtn, stockLeft <= 0 && { opacity: 0.3 }]}
              onPress={() => updateCartQuantity(product.id, 1)}
              disabled={stockLeft <= 0}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={16} color={COLORS.textDark} />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{quantity}</Text>

            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => updateCartQuantity(product.id, -1)}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={16} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          {/* Per-product delete button */}
          <TouchableOpacity
            style={styles.itemDeleteBtn}
            onPress={() => removeFromCart(product.id)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.accentRed} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header matching Figma: Back circle, "My Cart", Search / Clear circle */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('HomeTab');
            }
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Cart</Text>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.openDrawer()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={COLORS.textDark}
          />
        </TouchableOpacity>
      </View>

      {/* Part 1 Point 6: My Cart Screen (Admin and Customer access) */}
      <View style={styles.roleAccessBar}>
        <Ionicons
          name={role === 'admin' ? 'shield-checkmark' : 'person'}
          size={14}
          color={role === 'admin' ? COLORS.accentOrange : COLORS.accentGreen}
        />
        <Text style={styles.roleAccessText}>
          Point 6 (Admin & Customer): Accessible as <Text style={{ fontWeight: '800' }}>{role.toUpperCase()}</Text>
        </Text>
      </View>

      <View style={styles.responsiveWrapper}>
        {cart.length > 0 ? (
          <View style={{ flex: 1 }}>
            <FlatList
              data={cart}
              keyExtractor={(item) => item.product.id}
              renderItem={renderCartItem}
              contentContainerStyle={styles.listContent}
            />

            {/* Cart Pricing Summary matching Figma */}
            <View style={styles.footerSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal ({cart.length} items)</Text>
                <Text style={styles.summaryValue}>Rs {cartSubtotal.toFixed(2)}</Text>
              </View>

              {cartDiscount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: COLORS.accentGreen }]}>Special Discount</Text>
                  <Text style={[styles.summaryValue, { color: COLORS.accentGreen }]}>- Rs {cartDiscount.toFixed(2)}</Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>
                  {deliveryFee === 0 ? 'FREE' : `Rs ${deliveryFee.toFixed(2)}`}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>Rs {cartTotal.toFixed(2)}</Text>
              </View>

              {/* Figma Action Button: Book Now >>> */}
              <TouchableOpacity
                style={styles.bookNowBtn}
                onPress={handleBookNow}
                activeOpacity={0.85}
              >
                <Text style={styles.bookNowText}>Book Now &gt;&gt;&gt;</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Ionicons name="cart-outline" size={54} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptySubtitle}>
              Looks like you haven't added any fresh groceries yet. Explore our daily fruits and vegetables!
            </Text>
            <TouchableOpacity
              style={styles.startShoppingBtn}
              onPress={() => navigation.navigate('HomeTab')}
              activeOpacity={0.85}
            >
              <Text style={styles.startShoppingText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Checkout Order Confirmation Modal */}
      <Modal
        visible={checkoutModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setCheckoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {!orderConfirmed ? (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Confirm Your Booking</Text>
                  <TouchableOpacity onPress={() => setCheckoutModalVisible(false)}>
                    <Ionicons name="close" size={24} color={COLORS.textDark} />
                  </TouchableOpacity>
                </View>

                <View style={styles.orderSummaryBox}>
                  <Text style={styles.boxTitle}>Delivery Details</Text>
                  <Text style={styles.boxText}>
                    <Text style={{ fontWeight: '700' }}>Name: </Text>
                    {user.name}
                  </Text>
                  <Text style={styles.boxText}>
                    <Text style={{ fontWeight: '700' }}>Phone: </Text>
                    {user.phone}
                  </Text>
                  <Text style={styles.boxText}>
                    <Text style={{ fontWeight: '700' }}>Address: </Text>
                    {user.address}
                  </Text>
                  <Text style={styles.boxText}>
                    <Text style={{ fontWeight: '700' }}>Delivery Slot: </Text>
                    {user.preferredSlot}
                  </Text>
                </View>

                <View style={styles.orderPriceBox}>
                  <Text style={styles.boxTitle}>Order Breakdown</Text>
                  <Text style={styles.boxText}>Total Items: {cart.length} types</Text>
                  <Text style={styles.totalPriceHighlight}>
                    Grand Total: Rs {cartTotal.toFixed(2)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.confirmOrderBtn}
                  onPress={handleConfirmOrder}
                  activeOpacity={0.85}
                >
                  <Text style={styles.confirmOrderText}>Confirm & Place Order</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={64} color={COLORS.accentGreen} />
                <Text style={styles.successTitle}>Order Placed Successfully!</Text>
                <Text style={styles.successSubtitle}>
                  Your fresh groceries are scheduled for delivery to {user.address}.
                </Text>
                <Text style={styles.successAmount}>Amount Paid: Rs {cartTotal.toFixed(2)}</Text>
              </View>
            )}
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
  responsiveWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
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
  roleAccessBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 6,
  },
  roleAccessText: {
    fontSize: 11,
    color: COLORS.textDark,
    marginLeft: 6,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 22,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'transform 0.15s ease',
      },
    }),
  },
  imageWrapper: {
    width: 92,
    height: 92,
    borderRadius: 18,
    backgroundColor: '#F3F4EE',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  detailsCol: {
    flex: 1,
    marginLeft: 14,
  },
  productName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  productCategory: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 4,
  },
  itemTotal: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginTop: 2,
  },
  rightActionsCol: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  stepperContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FAF8',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  itemDeleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    ...Platform.select({
      web: { cursor: 'pointer', transition: 'transform 0.15s ease' },
    }),
  },
  stepperBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
    marginVertical: 4,
  },
  footerSummary: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 10 },
      android: { elevation: 6 },
      web: { boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' },
    }),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#ECECEC',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  bookNowBtn: {
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
        boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
        transition: 'transform 0.15s ease',
      },
    }),
  },
  bookNowText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  emptyIconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  startShoppingBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 25,
    ...Platform.select({
      web: { cursor: 'pointer', boxShadow: '0 4px 12px rgba(13, 148, 136, 0.35)' },
    }),
  },
  startShoppingText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    width: '100%',
    maxWidth: 440,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  orderSummaryBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  orderPriceBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  boxText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 4,
    lineHeight: 18,
  },
  totalPriceHighlight: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    marginTop: 6,
  },
  confirmOrderBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  confirmOrderText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.accentGreen,
    marginTop: 16,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 14,
  },
  successAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
});
