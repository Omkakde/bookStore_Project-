import { book, cart } from "../models/index";
import Books from '../models/book.model';
import { IBook } from './../interfaces/book.interface';
import { ICart } from './../interfaces/cart.interface';
import Carts from '../models/cart.model';
import sequelize, { DataTypes } from '../config/database';
import Order from "../models/order.model";
import redisClient from "../config/redis";
import { sendOrderSuccessful } from "../utils/mail.util";
import Details from "../models/userDetails.model";
import { sendToQueue } from "../utils/rabbitMQ";
export class OrderServies {
    private Cart = Carts(sequelize, DataTypes);
    private Books = Books(sequelize, DataTypes);
    private Orders = Order(sequelize,DataTypes);
    private Detail = Details(sequelize,DataTypes);
    public placeOrder = async (req) => {
        try {
          const userId = req.body.admin_user_id;      
          const cartItems = await this.Cart.findAll({ where: { user_id: userId } });
          const userDetails = await this.Detail.findAll({where:{user_Id:userId}});
          if (!cartItems || cartItems.length === 0) {
            throw new Error('No items in the cart to place an order');
          } 
           
          if (userDetails) {           
            await this.Detail.update(req.body, { where: { user_Id: userId } });
          } else {
            await this.Detail.create({ user_Id: userId, ...req.body });
          } 

          const books = await this.Books.findAll();
          let totalOrderPrice = 0;
      
          for (const item of cartItems) {
            const book = books.find((b: IBook) => b.id === item.book_id);
            if (!book) {
              throw new Error(`Book with ID ${item.book_id} not found`);
            }
      
            if (book.quantity < item.quantityBook) {
              throw new Error(`Insufficient stock for book: ${book.book_name}`);
            }
      
            totalOrderPrice += typeof item.total_price === 'string' ? parseFloat(item.total_price) : item.total_price;
      
            book.quantity -= item.quantityBook;
            await book.save();
          }
      
          const newOrder = {
            user_id: userId,
            items: cartItems.map((item) => ({
              book_id: item.book_id,
              quantity: item.quantityBook,
              total_price: item.total_price,
            })),
            total_price: totalOrderPrice,
            order_date: new Date(),
          };
      
          const order = await this.Orders.create(newOrder);
          await this.Cart.destroy({ where: { user_id: userId } });
          await redisClient.flushAll();
          const trasformedData={
            order,
            email:req.body.email,
          };
          await sendToQueue('orderQueue',trasformedData);
          return {
            message: 'Order placed successfully',
            order,
          };
        } catch (error) {
          throw error;
        }
      };

      public getOrders = async (req)=>{
        try{
            let orders = await this.Orders.findAll({where:{user_id:req.body.admin_user_id}});
            if (!orders || orders.length === 0) {
                throw new Error("No orders found for the user.");
            }
            return orders;
        }catch(error){
            throw error;
        }
      }
      
}
