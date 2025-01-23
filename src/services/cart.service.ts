import express from 'express';
import sequelize, { DataTypes } from '../config/database';
import { ICart } from './../interfaces/cart.interface';
import Carts from '../models/cart.model';
import { NextFunction, Request } from "express-serve-static-core";
import Books from '../models/book.model';
import { IBook } from './../interfaces/book.interface';

class cartServices{
    private Cart = Carts(sequelize, DataTypes);
    private Books = Books(sequelize, DataTypes);

    public addToCart = async (req, bookId: number, quantity: number) => {
      const userId = req.body.admin_user_id;
      const book = await this.Books.findOne({ where: { id: bookId } });
      if (!book) {
        throw new Error('Book not found');
      }
    
      if (book.quantity < quantity) {
        throw new Error('Not enough stock available');
      }
    
      const existCartItem = await this.Cart.findOne({
        where: { book_id: bookId, user_id: userId },
      });
    
      if (existCartItem) {
        existCartItem.quantityBook += quantity;
        existCartItem.total_price = (existCartItem.quantityBook += quantity) * book.discount_price;
        await existCartItem.save();
        return existCartItem;
      }
    
      const totalPrice = book.discount_price * quantity;
      const newCartItem: ICart = {
        book_id: bookId,
        user_id: userId,
        quantityBook: quantity,
        total_price: totalPrice,
      };
    
      const createdCartItem = await this.Cart.create(newCartItem);
      return createdCartItem;
    };
    

    public getCart = async (req) => {
      try {
        let user_Id = req.body.admin_user_id;
    
        let checkItems = await this.Cart.findAll({ where: { user_id: user_Id } });
        if (!checkItems || checkItems.length === 0) {
          throw new Error('No items in the cart');
        }
        let books = await this.Books.findAll();
        const { discountTotal, totalPrice } = checkItems.reduce(
          (totals, item) => {
            totals.discountTotal += typeof item.total_price === 'string' ? parseFloat(item.total_price) : item.total_price;
            const book = books.find((b: IBook) => b.id === item.book_id);
            if (book) {
              totals.totalPrice += book.price * item.quantityBook;
            }
            return totals;
          },
          { discountTotal: 0, totalPrice: 0 }
        );
    
    
        return { discountTotal, totalPrice, items: checkItems };
      } catch (error) {
        console.error("Error in getCart:", error.message);
        throw error;
      }
    };
    
      
      
      
      public updateCart = async (cartId, req) => {
        try {
          const userId = req.body.admin_user_id;
          const { newQuantity } = req.body;
      
          const checkItem = await this.Cart.findOne({ where: { id: cartId, user_id: userId } });
          const book = await this.Books.findOne({where:{id:checkItem.book_id}});
          if (!checkItem) {
            throw new Error('No items in the cart');
          }
      
          if (!newQuantity || newQuantity <= 0) {
            throw new Error('Quantity must be greater than zero');
          }
      
          checkItem.total_price = book.price * newQuantity; 
          checkItem.quantityBook = newQuantity;
          await checkItem.save();
      
          return {
            message: 'Cart updated successfully',
          };
        } catch (error) {
          throw error;
        }
      };
      
    

      public removeFromCart = async (cartId, userId) =>{
        try{
        let checkCart = await this.Cart.findOne({where:{id:cartId, user_id:userId}});
        if(!checkCart){
            throw new Error('Cart item not found or unauthorized access');
        }
        await checkCart.destroy();
        return {massage:'Cart item removed successfully', item:cartId};
      }catch(error){
        throw error;
      }
      }

}
export default cartServices;