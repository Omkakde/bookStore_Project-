import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { WishlistServices } from '../services/wishlist.service';
class wishListController{
    private WishlistServices= new WishlistServices();

    public addToWishList = async (req:Request, res:Response, next:NextFunction)=>{
        try{
            let data = await this.WishlistServices.addBook(req);
            res.status(200).json({
                success: true,
                message: 'Book added to wishlist successfully',
                
            });
        }catch(error){
            res.status(400).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
            next(error);
        }
    }

    public removeBook = async (req:Request, res:Response, next:NextFunction)=>{
        try{
            let data = await this.WishlistServices.removeBook(req);
            res.status(200).json({
                success: true,
                message: 'Book remove from wishlist successfully'
            });
        }catch(error){
            res.status(400).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
            next(error);
        }
    }

    public getAllBook = async (req:Request, res:Response, next:NextFunction)=>{
        try{
            const wishlist= await this.WishlistServices.getWishlist(req);
            if (!wishlist || wishlist.books.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Wishlist is empty',
                    data: wishlist,  
                });
            }
            res.status(200).json({
                success: true,
                message: 'Wishlist retrieved successfully',
                data: wishlist,
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || 'An error occurred while retrieving the wishlist',
            });
        }
    }
}export default wishListController;