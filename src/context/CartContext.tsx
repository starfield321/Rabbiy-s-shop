'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Supabaseをインポート

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size?: string | null) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  totalQuantity: number;
  updateQuantity: (id: string, size: string | undefined, delta: number) => void;
  syncPrices: () => Promise<void>; // 追加
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 価格同期ロジック：DBから最新価格を取得してカートを更新
  const syncPrices = async () => {
    if (cartItems.length === 0) return;
    
    const itemIds = cartItems.map(item => item.id);
    const { data: latestGoods, error } = await supabase
      .from('goods')
      .select('id, price')
      .in('id', itemIds);

    if (latestGoods && !error) {
      setCartItems(prev => prev.map(item => {
        const latest = latestGoods.find(g => g.id === item.id);
        // 価格が異なる場合のみ更新
        if (latest && latest.price !== item.price) {
          return { ...item, price: latest.price };
        }
        return item;
      }));
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('rabbiy_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCartItems(parsed);
      } catch (e) {
        console.error("カートの復元に失敗しました", e);
      }
    }
  }, []);

  // カートが読み込まれた後、一度だけ価格を最新にする
  useEffect(() => {
    if (cartItems.length > 0) {
      syncPrices();
    }
  }, []); 

  useEffect(() => {
    localStorage.setItem('rabbiy_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find(i => i.id === newItem.id && i.size === newItem.size);
      if (existing) {
        return prev.map(i => 
          (i.id === newItem.id && i.size === newItem.size) 
          ? { ...i, quantity: i.quantity + newItem.quantity } 
          : i
        );
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, size?: string | null) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('rabbiy_cart');
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  const updateQuantity = (id: string, size: string | undefined, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id && item.size === size) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, clearCart, 
      isCartOpen, setIsCartOpen, cartTotal, totalQuantity, 
      updateQuantity, syncPrices 
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