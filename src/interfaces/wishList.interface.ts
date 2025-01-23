import { IBook } from './book.interface'; 
export interface IWishlist {
  id?: number;
  user_id: number;
  books: IBook[];
}