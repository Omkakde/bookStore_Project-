import express,{Router,IRouter} from 'express';
import cartControllers from './../controllers/cart.controller';
import { isUser, userAuth } from '../middlewares/auth.middleware';
import { CartValidator } from '../validators/cart.validator';

class cartRoutes{
    private cartController = new cartControllers();
    private router = express.Router();
    private CartValidator = new CartValidator();
    constructor(){
        this.routes();
    }
    private routes = () =>{
        this.router.post('/:id/add_To_Cart',this.CartValidator.addBookValid,userAuth,isUser, this.cartController.addToCart);
        this.router.get('/get-cart-items', userAuth,isUser, this.cartController.getCart);
        this.router.put('/:id/cart_item_quantity', userAuth,isUser, this.cartController.updateCart);
        this.router.delete('/:id/remove_cart_item',this.CartValidator.removeBookValid,userAuth,isUser, this.cartController.removeFromCart);
    }
    public getRoutes=(): IRouter => {
        return this.router;
    }
}
export default cartRoutes;