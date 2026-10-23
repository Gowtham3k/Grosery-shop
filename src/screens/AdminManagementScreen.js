import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useShop } from '../context/ShopContext';

export default function AdminManagementScreen({ navigation }) {
  const { products, toggleProductStock, updateProduct, addProduct, role, setRole } = useShop();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states for add / edit
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Fruits');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Fruits');
    setPrice('');
    setUnit('kg');
    setImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80');
    setDescription('');
    setFormError('');
    setModalVisible(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategory(prod.category);
    setPrice(prod.price.toString());
    setUnit(prod.unit || 'kg');
    setImage(prod.image);
    setDescription(prod.description);
    setFormError('');
    setModalVisible(true);
  };

  const handleSaveProduct = () => {
    if (!name.trim() || !price.trim()) {
      setFormError('Product name and price are required.');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setFormError('Please enter a valid price greater than 0.');
      return;
    }

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: name.trim(),
        fullName: 'Fresh ' + name.trim(),
        category,
        price: numPrice,
        unit,
        image: image.trim() || editingProduct.image,
        description: description.trim() || editingProduct.description,
      });
    } else {
      addProduct({
        name: name.trim(),
        fullName: 'Fresh ' + name.trim(),
        category,
        price: numPrice,
        unit,
        image: image.trim() || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
        description: description.trim() || 'Freshly picked farm produce with rich natural taste.',
      });
    }

    setModalVisible(false);
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productRow}>
      <Image source={{ uri: item.image }} style={styles.prodThumb} resizeMode="contain" />

      <View style={styles.prodInfo}>
        <View style={styles.titleLine}>
          <Text style={styles.prodName}>{item.name}</Text>
          <View
            style={[
              styles.stockBadge,
              { backgroundColor: item.inStock ? '#E8F5E9' : '#FFEBEE' },
            ]}
          >
            <Text
              style={[
                styles.stockBadgeText,
                { color: item.inStock ? COLORS.accentGreen : COLORS.accentRed },
              ]}
            >
              {item.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>

        <Text style={styles.prodSub}>
          {item.category} • Rs {item.price}/{item.unit}
        </Text>
      </View>

      <View style={styles.actionBtnsCol}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => toggleProductStock(item.id)}
        >
          <Ionicons
            name={item.inStock ? 'toggle' : 'toggle-outline'}
            size={22}
            color={item.inStock ? COLORS.accentGreen : COLORS.textMuted}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="create-outline" size={18} color={COLORS.primaryDark} />
        </TouchableOpacity>
      </View>
    </View>
  );

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

        <Text style={styles.headerTitle}>Admin Product Manager</Text>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={openAddModal}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={22} color={COLORS.accentGreen} />
        </TouchableOpacity>
      </View>

      <View style={styles.adminBanner}>
        <Ionicons name="shield-checkmark" size={18} color={COLORS.accentOrange} />
        <Text style={styles.adminBannerText}>
          Logged in as Administrator. Toggle stock, edit prices or add items.
        </Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Add / Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

            <Text style={styles.inputLabel}>Product Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Avocado"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryPickerRow}>
              {['Fruits', 'Vegetables'].map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.catChoiceBtn,
                    category === c && styles.catChoiceBtnActive,
                  ]}
                  onPress={() => setCategory(c)}
                >
                  <Text
                    style={[
                      styles.catChoiceText,
                      category === c && styles.catChoiceTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.twoColRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.inputLabel}>Price (Rs) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 150"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>

              <View style={{ width: 90 }}>
                <Text style={styles.inputLabel}>Unit</Text>
                <TextInput
                  style={styles.input}
                  placeholder="kg / pc"
                  value={unit}
                  onChangeText={setUnit}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Image URL (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://..."
              value={image}
              onChangeText={setImage}
            />

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSaveProduct}
            >
              <Text style={styles.submitBtnText}>
                {editingProduct ? 'Update Product' : 'Add Product to Catalog'}
              </Text>
            </TouchableOpacity>
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
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.06)' },
    }),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFE082',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderRadius: 12,
  },
  adminBannerText: {
    fontSize: 12,
    color: '#8D6E63',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  productRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.05)' },
    }),
  },
  prodThumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  prodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prodName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  stockBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  stockBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  prodSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  actionBtnsCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 6,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
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
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginBottom: 10,
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
    borderColor: '#E2E8D5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 12,
  },
  categoryPickerRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  catChoiceBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginRight: 8,
  },
  catChoiceBtnActive: {
    backgroundColor: COLORS.primary,
  },
  catChoiceText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  catChoiceTextActive: {
    color: COLORS.white,
  },
  twoColRow: {
    flexDirection: 'row',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});
