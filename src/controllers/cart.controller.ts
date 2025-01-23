import express from 'express';
import cartServices from '../services/cart.service';
import { Request,Response, NextFunction } from 'express-serve-static-core';
import httpStatus from 'http-status-codes';

class cartControllers{
    private cartServices= new cartServices();

    public addToCart = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const bookId = req.params.id;
        const { quantity } = req.body;
    
        if (!bookId || !quantity) {
          return res.status(400).json({ success: false, message: 'Book ID and quantity are required' });
        }
        const cartItem = await this.cartServices.addToCart(req, Number(bookId), quantity);
        res.status(201).json({
          success: true,
          message: 'Book added to cart successfully!',
          data: cartItem,
        });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add book to cart', error: error.message });
      }
    };
    
    public getCart = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const cartItems = await this.cartServices.getCart(req);
        res.status(200).json({
          success: true,
          message: 'Cart items retrieved successfully',
          discountTotal:cartItems.discountTotal,
           totalPrice:cartItems.totalPrice,
          items: cartItems.items,
        });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve cart items', error: error.message });
      }
    };
    
    public updateCart = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const cartId = req.params.id;
    
        if (!cartId) {
          return res.status(400).json({ success: false, message: 'Cart ID is required' });
        }
        const updated = await this.cartServices.updateCart(cartId, req);
        res.status(200).json({
          success: true,
          message: 'Book quantity updated successfully!',
          updated,
        });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update cart', error: error.message });
      }
    };
    
    public removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.body.admin_user_id;
        const id = parseInt(req.params.id);
    
        if (!id) {
          return res.status(400).json({ success: false, message: 'Cart ID is required' });
        }
        const checkItem = await this.cartServices.removeFromCart(id, userId);
        res.status(200).json({
          success: true,
          message: checkItem,
          item: checkItem.item,
        });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to remove item from cart', error: error.message });
      }
    };
    
    };
export default cartControllers;