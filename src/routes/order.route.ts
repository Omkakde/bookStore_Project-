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
    /**
 * @openapi
 * /api/v1/order/:
 *   post:
 *     tags:
 *       - Order
 *     description: Place an order for books by providing user details .
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullAddress:
 *                 type: string
 *                 example: "123 Main St, Apartment 4B"
 *               city:
 *                 type: string
 *                 example: "Pune"
 *               state:
 *                 type: string
 *                 example: "Maharashtra"
 *               cartItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     book_id:
 *                       type: integer
 *                       example: 1
 *                     quantityBook:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order placed successfully.
 *       400:
 *         description: Invalid data, order not found, or authorization error.
 *       500:
 *         description: Server error while processing the order.
 *     security:
 *       - BearerAuth: []
 */
        this.router.post('/', userAuth, isUser, this.orderControllers.placeOrder);

        /** 
 * @openapi
 * /api/v1/order/:
 *   get:
 *     tags:
 *       - Order
 *     description: Get all orders for the authenticated user
 *     responses:
 *       200:
 *         description: Order history retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully retrieved orders"
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       user_id:
 *                         type: integer
 *                         example: 4
 *                       total_price:
 *                         type: number
 *                         format: float
 *                         example: 29.98
 *                       order_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-21T11:40:24.664Z"
 *       401:
 *         description: Unauthorized. User is not authenticated.
 *       404:
 *         description: No orders found for the user.
 *       500:
 *         description: Server error while fetching orders.
 */
        this.router.get('/', userAuth, isUser, this.orderControllers.getAllOrders);
    }
    public getRoutes= ():IRouter=>{
        return this.router;
    }

}export default orderRoutes;