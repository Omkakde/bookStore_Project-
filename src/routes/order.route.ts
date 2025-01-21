import express,{Router,IRouter} from 'express';
import { isUser, userAuth } from '../middlewares/auth.middleware';
import orderControllers from '../controllers/order.controller';
import { IOrder } from '../interfaces/order.interface';
class orderRoutes{
    private router = express.Router();
    private orderControllers = new orderControllers();
    constructor(){
        this.routes();
    }
    private routes = ()=>{
        this.router.post('/', userAuth, isUser, this.orderControllers.placeOrder);
        this.router.get('/', userAuth, isUser, this.orderControllers.getAllOrders);
    }
    public getRoutes= ():IRouter=>{
        return this.router;
    }

}export default orderRoutes;