import express from 'express';
import sequelize, { DataTypes } from '../config/database';
import { ICart } from './../interfaces/cart.interface';
import Carts from '../models/cart.model';
import { NextFunction, Request } from "express-serve-static-core";
import Books from '../models/book.model';

class cartServices{
    private Cart = Carts(sequelize, DataTypes);
    private Books = Books(sequelize, DataTypes);

    public  addToCart = async (req, bookId: number, quantity: number) =>{
        const userId= req.body.admin_user_id; 
        const book = await this.Books.findOne({ where: { id: bookId } });
        if (!book) {
          throw new Error('Book not found');
        }
        if (book.quantity < quantity) {
          throw new Error('Not enough stock available');
        }
        const totalPrice = book.discount_price * quantity;
        const existCartItem = await this.Cart.findOne({
          where: { book_id: bookId, user_id: userId },
        });
    
        if(existCartItem) {
            existCartItem.quantityBook += quantity;
            existCartItem.total_price += totalPrice;
            await existCartItem.save();
            return existCartItem;
        }

        const newCartItem: ICart = {
          book_id: bookId,
          user_id: userId,
          quantityBook: quantity,
          total_price: totalPrice,
        };
        const createdCartItem = await this.Cart.create(newCartItem);
        return createdCartItem;
      }

      public getCart = async (req) => {
        try {
          let user_Id = req.body.admin_user_id;
          let checkItems = await this.Cart.findAll({ where: { user_id: user_Id } });
      
          if (!checkItems || checkItems.length === 0) {
            throw new Error('No items in the cart');
          }
      
          let cartTotalPrice = '';
          checkItems.forEach((item) => {
            cartTotalPrice += item.total_price;
          });
      
          return { cartTotal: cartTotalPrice, items: checkItems };
        } catch (error) {
          console.error("Error in getCart:", error.message);
          throw error;
        }
      };
      
      public updateCart = async (cartId,req)=>{
        try{
        const userId = req.body.admin_user_id;
        const {newQuantity} = req.body;
        const checkItem = await this.Cart.findOne({where:{ id:cartId,user_id:userId}});
        if (!checkItem) {
          throw new Error('No items in the cart');
        }
        if (!newQuantity || newQuantity <= 0) {
          throw new Error('Quantity must be greater than zero');
        }
        checkItem.total_price = (checkItem.total_price / checkItem.quantityBook) * newQuantity;
        checkItem.quantityBook = newQuantity;
        await checkItem.save();
        return {
          message: 'Cart updated successfully',
          updatedItem: checkItem,
        };
      }catch(error){
        console.error('Error in updateCart:', error.message);
        throw error;
      }
    }

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