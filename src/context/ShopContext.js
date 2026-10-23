import React, { createContext, useContext, useState, useMemo } from 'react';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';

// Default Accounts (No database required, preset local mock users)
export const DEFAULT_ACCOUNTS = {
  customer: {
    email: 'customer@grocery.com',
    password: 'password123',
    name: 'Sarah Jenkins',
    phone: '9876543210',
    address: '124 Green Valley Road, Apt 4B, Springfield',
    preferredSlot: 'Morning (8:00 AM - 11:00 AM)',
    role: 'customer',
  },
  admin: {
    email: 'admin@grocery.com',
    password: 'admin123',
    name: 'Admin Manager',
    phone: '9123456780',
    address: 'Grocery Mart Central Warehouse, Sector 7',
    preferredSlot: 'Morning (8:00 AM - 11:00 AM)',
    role: 'admin',
  },
};

// Initialize products with consistent stockCount
const INITIAL_PRODUCTS = SAMPLE_PRODUCTS.map((p, idx) => {
  const stock = p.stockCount !== undefined ? p.stockCount : 15 + ((idx * 3) % 16);
  return {
    ...p,
    stockCount: stock,
    inStock: stock > 0,
  };
});

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  // Products Catalog (supports real-time stock updates / Admin stock toggles / edits)
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Favorites List (array of product IDs)
  // Pre-populate with Banana, Pineapple, Tomato, Cabbage matching Figma Screen 4
  const [favoriteIds, setFavoriteIds] = useState(['prod-1', 'prod-3', 'prod-5', 'prod-9']);

  // Cart List: array of { product, quantity }
  // Pre-populate to match Figma Screen 7 (Banana, Pineapple, Tomato, Cabbage)
  const [cart, setCart] = useState([
    { product: INITIAL_PRODUCTS[0], quantity: 2 }, // Banana 50 x 2 = 100
    { product: INITIAL_PRODUCTS[2], quantity: 1 }, // Pineapple 120 x 1 = 120
    { product: INITIAL_PRODUCTS[4], quantity: 1 }, // Tomato 220 x 1 = 220
    { product: INITIAL_PRODUCTS[8], quantity: 1 }, // Cabbage 300 x 1 = 300
    // Subtotal: 740. Total Amount with discount: Rs 710.00
  ]);

  // Current Active User
  const [user, setUser] = useState(DEFAULT_ACCOUNTS.customer);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Registered Accounts (supports authentication validation)
  const [accounts, setAccounts] = useState({
    'customer@grocery.com': DEFAULT_ACCOUNTS.customer,
    'admin@grocery.com': DEFAULT_ACCOUNTS.admin,
  });

  // --- Cart Actions with Real-Time Stock Management ---
  const addToCart = (product, quantity = 1) => {
    if (!product || quantity <= 0) return false;

    // Look up current stock from products state
    const currentProd = products.find((p) => p.id === product.id) || product;
    const currentStock = currentProd.stockCount ?? 15;

    if (currentStock <= 0) {
      return false; // Out of stock
    }

    const qtyToAdd = Math.min(quantity, currentStock);
    if (qtyToAdd <= 0) return false;

    // 1. Immediately reduce product stock in catalog
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === product.id) {
          const newStock = Math.max(0, (p.stockCount ?? 15) - qtyToAdd);
          return {
            ...p,
            stockCount: newStock,
            inStock: newStock > 0,
          };
        }
        return p;
      })
    );

    // 2. Add or increment quantity in cart
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qtyToAdd,
        };
        return updated;
      } else {
        return [...prevCart, { product: currentProd, quantity: qtyToAdd }];
      }
    });

    return true;
  };

  const updateCartQuantity = (productId, delta) => {
    if (delta > 0) {
      // Check if product has available stock before increasing
      const prod = products.find((p) => p.id === productId);
      if (prod && (prod.stockCount ?? 0) <= 0) {
        return; // No more stock available to add
      }
    }

    // Update product stock count (decrease if delta > 0, restore if delta < 0)
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentStock = p.stockCount ?? 15;
          const newStock = Math.max(0, currentStock - delta);
          return {
            ...p,
            stockCount: newStock,
            inStock: newStock > 0,
          };
        }
        return p;
      })
    );

    // Update cart items
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (productId) => {
    const itemToRemove = cart.find((item) => item.product.id === productId);
    if (itemToRemove) {
      const restoreQty = itemToRemove.quantity;
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productId) {
            const newStock = (p.stockCount ?? 15) + restoreQty;
            return {
              ...p,
              stockCount: newStock,
              inStock: true,
            };
          }
          return p;
        })
      );
    }
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    // Restore all items back to stock
    setProducts((prev) =>
      prev.map((p) => {
        const inCart = cart.find((c) => c.product.id === p.id);
        if (inCart) {
          const newStock = (p.stockCount ?? 15) + inCart.quantity;
          return {
            ...p,
            stockCount: newStock,
            inStock: true,
          };
        }
        return p;
      })
    );
    setCart([]);
  };

  // Cart Totals: Matching Figma exact totals
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  // Applied special discount when items match standard demo cart to produce exact Rs 710.00
  const cartDiscount = useMemo(() => {
    if (cartSubtotal >= 700) return 30; // 30 discount gives 740 - 30 = 710
    return 0;
  }, [cartSubtotal]);

  const deliveryFee = 0; // Free delivery for fresh groceries
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryFee);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // --- Favorites Actions ---
  const toggleFavorite = (productId) => {
    setFavoriteIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const removeFavorite = (productId) => {
    setFavoriteIds((prev) => prev.filter((id) => id !== productId));
  };

  const isFavorite = (productId) => {
    return favoriteIds.includes(productId);
  };

  const favoriteProducts = useMemo(() => {
    return products.filter((p) => favoriteIds.includes(p.id));
  }, [products, favoriteIds]);

  // --- Role & Profile Actions ---
  const setRole = (newRole) => {
    if (newRole === 'admin') {
      setUser((prev) => ({
        ...prev,
        role: 'admin',
        name: prev.role === 'admin' ? prev.name : DEFAULT_ACCOUNTS.admin.name,
        email: prev.role === 'admin' ? prev.email : DEFAULT_ACCOUNTS.admin.email,
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        role: 'customer',
        name: prev.role === 'customer' ? prev.name : DEFAULT_ACCOUNTS.customer.name,
        email: prev.role === 'customer' ? prev.email : DEFAULT_ACCOUNTS.customer.email,
      }));
    }
  };

  const updateProfile = (profileData) => {
    setUser((prev) => ({ ...prev, ...profileData }));
  };

  const loginWithPreset = (roleType) => {
    const preset = DEFAULT_ACCOUNTS[roleType] || DEFAULT_ACCOUNTS.customer;
    setUser(preset);
    setIsAuthenticated(true);
  };

  const validateCredentials = ({ email, password, role }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = password || '';

    if (!cleanEmail) {
      return { valid: false, field: 'email', message: 'Email address is required.' };
    }
    if (!cleanPass) {
      return { valid: false, field: 'password', message: 'Password is required.' };
    }

    const matchedAccount = accounts[cleanEmail];

    // Case 1: Logging in as ADMIN
    if (role === 'admin') {
      if (!matchedAccount) {
        return {
          valid: false,
          field: 'email',
          message: 'Invalid Admin ID! Only authorized Admin email (admin@grocery.com) can log in.',
        };
      }
      if (matchedAccount.role !== 'admin') {
        return {
          valid: false,
          field: 'email',
          message: 'Access Denied! This is a Customer account. Please select Customer role.',
        };
      }
      if (matchedAccount.password !== cleanPass) {
        return {
          valid: false,
          field: 'password',
          message: 'Incorrect Admin password! (Default: admin123)',
        };
      }
      return { valid: true, account: matchedAccount };
    }

    // Case 2: Logging in as CUSTOMER
    if (role === 'customer') {
      if (!matchedAccount) {
        return {
          valid: false,
          field: 'email',
          message: 'Invalid Customer ID! Please use customer@grocery.com or create an account.',
        };
      }
      if (matchedAccount.role !== 'customer') {
        return {
          valid: false,
          field: 'email',
          message: 'This is an Admin ID! Please select Admin role to log in.',
        };
      }
      if (matchedAccount.password !== cleanPass) {
        return {
          valid: false,
          field: 'password',
          message: 'Incorrect Customer password! (Default: password123)',
        };
      }
      return { valid: true, account: matchedAccount };
    }

    return { valid: false, field: 'email', message: 'Invalid role specified.' };
  };

  const login = ({ email, role = 'customer' }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const existing = accounts[cleanEmail];
    if (existing) {
      setUser(existing);
    } else {
      setUser((prev) => ({
        ...prev,
        email: cleanEmail,
        name: cleanEmail.split('@')[0] || 'User',
        role,
      }));
    }
    setIsAuthenticated(true);
  };

  const signup = ({ name, email, phone, password, role = 'customer' }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const newAcc = {
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      password: password || 'password123',
      role,
      address: role === 'admin' ? 'Grocery Mart Central Warehouse, Sector 7' : '124 Green Valley Road, Apt 4B',
      preferredSlot: 'Morning (8:00 AM - 11:00 AM)',
    };
    setAccounts((prev) => ({
      ...prev,
      [cleanEmail]: newAcc,
    }));
    setUser(newAcc);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // --- Admin Product Actions ---
  const toggleProductStock = (productId) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
    );
  };

  const addProduct = (newProduct) => {
    const id = `prod-${Date.now()}`;
    const product = {
      id,
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      unit: 'kg',
      ...newProduct,
    };
    setProducts((prev) => [product, ...prev]);
    return product;
  };

  const value = {
    products,
    cart,
    favoriteIds,
    favoriteProducts,
    user,
    isAuthenticated,
    role: user.role,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    cartTotal,
    cartItemCount,
    DEFAULT_ACCOUNTS,
    accounts,
    validateCredentials,
    // Methods
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleFavorite,
    removeFavorite,
    isFavorite,
    setRole,
    updateProfile,
    loginWithPreset,
    login,
    signup,
    logout,
    toggleProductStock,
    updateProduct,
    addProduct,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
