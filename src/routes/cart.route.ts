import express,{Router,IRouter} from 'express';
import cartControllers from './../controllers/cart.controller';
import { userAuth } from '../middlewares/auth.middleware';
import { CartValidator } from '../validators/cart.validator';
CartValidator
class cartRoutes{
    private cartController = new cartControllers();
    private router = express.Router();
    private CartValidator = new CartValidator();
    constructor(){
        this.routes();
    }
    private routes = () =>{
        this.router.post('/:id/add_To_Cart',this.CartValidator.addBookValid,userAuth, this.cartController.addToCart);
        this.router.get('/get-cart-items', userAuth, this.cartController.getCart);
        this.router.put('/:id/cart_item_quantity', userAuth, this.cartController.updateCart);
        this.router.delete('/:id/remove_cart_item',this.CartValidator.removeBookValid,userAuth, this.cartController.removeFromCart);
    }
    public getRoutes=(): IRouter => {
        return this.router;
    }
}
export default cartRoutes;