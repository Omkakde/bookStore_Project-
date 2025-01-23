export interface IOrder {
    id?: number;
    user_id: number;
    items: { book_id: number; quantity: number; total_price: number }[];
    total_price: number;
    order_date?: Date;
  }
  