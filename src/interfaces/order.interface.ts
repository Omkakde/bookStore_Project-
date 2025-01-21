export interface IOrder {
    id?: number;
    user_id: number;
    items: [];
    total_price: number;
    order_date?: Date;
  }
  