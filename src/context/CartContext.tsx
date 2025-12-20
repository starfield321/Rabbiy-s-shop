'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// アイテムの型を CartDrawer に合わせる
type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string; // page.tsx の images[0] を入れるため追加
  size?: string | null; // サイズ対応
  quantity: number;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size?: string | null) => void; // 追加
  isCartOpen: boolean; // 追加
  setIsCartOpen: (open: boolean) => void; // 追加
  totalQuantity: number;
  cartTotal: number; // 追加
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // カートの開閉状態

  const addToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      // 同じIDかつ同じサイズの商品がすでにあるかチェック
      const existingItem = prev.find(
        (item) => item.id === newItem.id && item.size === newItem.size
      );
      if (existingItem) {
        return prev.map((item) =>
          item.id === newItem.id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true); // 追加したら自動で開く
  };

  // カートから削除する機能
  const removeFromCart = (id: string, size?: string | null) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      isCartOpen, 
      setIsCartOpen, 
      totalQuantity, 
      cartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};