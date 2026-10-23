import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

export default function ProductsListScreen({ navigation }) {
  const { products, role, setRole } = useShop();

  const [selectedCategory, setSelectedCategory] = useState('Fruits');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const categories = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Beverages', 'All'];

  // Filter products by selected category and search query
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ? true : item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleRoleToggle = () => {
    const nextRole = role === 'admin' ? 'customer' : 'admin';
    setRole(nextRole);
  };

  const renderHeader = () => (
    <View style={styles.headerWrapper}>
      {/* Top Bar with Drawer Hamburger, Home (Sign In/Up) and Search Toggle */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.openDrawer()}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={22} color={COLORS.textDark} />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.7}
          >
            <Ionicons name="home-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => setShowSearch(!showSearch)}
            activeOpacity={0.7}
          >
            <Ionicons name={showSearch ? 'close' : 'search'} size={20} color={COLORS.textDark} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Title: "Daily Grocery Food" matching Figma */}
      <View style={styles.titleSection}>
        <Text style={styles.titleLine1}>Daily</Text>
        <Text style={styles.titleLine2}>Grocery Food</Text>
      </View>

      {/* Expandable Search Input */}
      {showSearch && (
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={18} color={COLORS.textLight} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search fruits, vegetables..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      {/* Category Pills with horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScrollContent}
        style={styles.categoriesScrollView}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryPill,
                isActive ? styles.categoryPillActive : styles.categoryPillInactive,
              ]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  isActive ? styles.categoryPillTextActive : styles.categoryPillTextInactive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Section Subtitle */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'Fruits'
            ? 'Found more fruits !'
            : selectedCategory === 'Vegetables'
            ? 'Found more vegetables !'
            : selectedCategory === 'Dairy'
            ? 'Fresh Dairy Products !'
            : selectedCategory === 'Bakery'
            ? 'Fresh Bakery Items !'
            : selectedCategory === 'Beverages'
            ? 'Healthy Beverages !'
            : 'All Fresh Groceries'}
        </Text>
        <Text style={styles.productCount}>{filteredProducts.length} items</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.responsiveWrapper}>
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="basket-outline" size={48} color={COLORS.textLight} />
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptySubtitle}>Try searching for something else or change filter</Text>
            </View>
          }
        />
      </View>
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  headerWrapper: {
    paddingTop: 10,
    paddingBottom: 8,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
  },
  titleSection: {
    marginBottom: 16,
  },
  titleLine1: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textDark,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  titleLine2: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textDark,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  categoriesScrollView: {
    marginBottom: 18,
  },
  categoriesScrollContent: {
    paddingRight: 10,
    flexDirection: 'row',
  },
  categoryPill: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.15s ease, background-color 0.2s ease',
      },
    }),
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    ...Platform.select({
      web: { boxShadow: '0 3px 10px rgba(13, 148, 136, 0.35)' },
    }),
  },
  categoryPillInactive: {
    backgroundColor: COLORS.inactivePill,
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '800',
  },
  categoryPillTextActive: {
    color: COLORS.white,
  },
  categoryPillTextInactive: {
    color: COLORS.inactivePillText,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  productCount: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
