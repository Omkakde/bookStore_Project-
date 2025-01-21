import express, {Router,IRouter} from 'express';
import wishListController from '../controllers/wishlist.controller';
import { WishlistValidator } from '../validators/wishlist.validator';
import {  isAdmin, isUser,userAuth } from '../middlewares/auth.middleware';
class wishListRoutes{
    private WishListController = new wishListController();
    private router= express.Router();
    private WishlistValidator =  new WishlistValidator();

    constructor(){
        this.routes();
    }
    private routes= ()=>{
        this.router.post('/:id/addBook',this.WishlistValidator.addBookValid ,userAuth,isUser,this.WishListController.addToWishList);
        this.router.delete('/:id/removeBook',this.WishlistValidator.removeBookValid,userAuth, isUser, this.WishListController.removeBook);
        this.router.get('/getAll', userAuth,isUser, this.WishListController.getAllBook);
    }
     public getRoutes=(): IRouter => {
            return this.router;
        }

}
export default wishListRoutes;