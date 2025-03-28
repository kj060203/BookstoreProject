import { Book } from './Book';

export interface CartItem {
  bookID: number;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
  book: Book; // This will be calculated dynamically
}
