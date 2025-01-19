import express from 'express';
import cartServices from '../services/cart.service';
import { Request,Response, NextFunction } from 'express-serve-static-core';
import httpStatus from 'http-status-codes';

class cartControllers{
    private cartServices= new cartServices();

    public addToCart= async(req: Request, res: Response, next: NextFunction)=>{
        try {
          const bookId= req.params.id;
          const { quantity } = req.body;
          if (!bookId || !quantity) {
            res.status(400).json({ message: 'Book ID and quantity are required' });
            return;
          }
          const cartItem = await this.cartServices.addToCart(req,Number(bookId), quantity);
          res.status(201).json({
            message: 'Book added to cart successfully!',
            data: cartItem,
          });
        } catch (error) {
          next(error);
        }
      }

      public getCart = async (req: Request, res: Response, next: NextFunction) => {
        try {  
          let cartItems = await this.cartServices.getCart(req);
          res.status(200).json({
            message: 'Cart items retrieved successfully',
            cartTotal: cartItems.cartTotal,
            items: cartItems.items,
          });
        } catch (error) {
          next(error);
        }
      };

      public updateCart= async (req:Request, res:Response, next:NextFunction)=>{
        try{
          const cartId = req.params.id;
          if (!cartId) {
            res.status(400).json({ message: 'Cart ID is required' });
            return;
          }
          let updated = await this.cartServices.updateCart(cartId, req);
          res.status(200).json({
            massage:" Book quantity updated succesfully!",
            updated,
          });

        }catch(error){
           next(error);
        }
      }
      

      public removeFromCart= async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const userId = req.body.admin_user_id; 
            const id= parseInt(req.params.id);
           
            if (!id) {
              res.status(400).json({ message: 'Cart ID is required' });
              return;
            }
            const checkItem = await this.cartServices.removeFromCart(id, userId);
            res.status(200).json({
              message:checkItem.massage,
              item:checkItem.item,
            });
          } catch (error) {
            next(error);
          }
      }

    };
export default cartControllers;