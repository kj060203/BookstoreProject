/* import { createContext, ReactNode, useContext, useState } from 'react';
import { CartItem } from '../types/CartItem';

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: CartItem) => void;
  removeFromCart: (bookID: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (book: CartItem) => {
    setCart((prev) => {
      const bookIndex = prev.findIndex(
        (item: { title: string }) => item.title === book.title
      );
      if (bookIndex === -1) {
        return [...prev, book];
      } else {
        const newCart = [...prev];
        newCart[bookIndex].quantity += book.quantity;
        return newCart;
      }
    });
  };

  const removeFromCart = (bookID: number) => {
    setCart((prev: any[]) => prev.filter((item) => item.bookID !== bookID));
  };

  const clearCart = () => {
    setCart(() => []);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types/Book'; // Ensure this is the correct path

interface CartItem extends Book {
  book: any;
  quantity: number;
  subtotal: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book) => void;
  removeItem: (bookID: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book: Book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.book.bookID === book.bookID
      );

      if (existingItem) {
        // If the book is already in the cart, update the quantity and subtotal
        return prevCart.map((item) =>
          item.book.bookID === book.bookID
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.book.price, // Recalculate subtotal
              }
            : item
        );
      } else {
        // If the book is not in the cart, add it as a new item
        const newItem: CartItem = {
          book: book, // Book object
          quantity: 1,
          subtotal: book.price, // Subtotal for one item
          bookID: book.bookID,
          title: book.title,
          price: book.price,
          author: '',
          publisher: '',
          isbn: '',
          classification: '',
          category: '',
          pageCount: 0,
        };

        return [...prevCart, newItem];
      }
    });
  };

  const removeItem = (bookID: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.bookID !== bookID));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
