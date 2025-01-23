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
        /**
 * @openapi
 * /api/v1/cart/{id}/add_To_Cart:
 *   post:
 *     tags:
 *       - Cart
 *     description: Add a book to the user's cart.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to add to the cart.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Book added to cart successfully.
 *       400:
 *         description: Invalid data, book not found, or authorization error.
 */
        this.router.post('/:id/add_To_Cart',this.CartValidator.addBookValid,userAuth,isUser, this.cartController.addToCart);

/**
 * @openapi
 * /api/v1/get-cart-items:
 *   get:
 *     tags:
 *       - Cart
 *     description: Retrieve all items in the user's cart.
 *     responses:
 *       200:
 *         description: Successfully retrieved cart items.
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
 *                   example: "Cart items retrieved successfully"
 *                 discountTotal:
 *                   type: number
 *                   example: 7282.98
 *                 totalPrice:
 *                   type: number
 *                   example: 9945.98
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     additionalProperties: true  # Allows any properties
 *       400:
 *         description: Failed to retrieve cart items or authorization error.
 */
        this.router.get('/get-cart-items', userAuth,isUser, this.cartController.getCart);

        /**
 * @openapi
 * /api/v1/{id}/cart_item_quantity:
 *   put:
 *     tags:
 *       - Cart
 *     description: Update the quantity of a specific cart item.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart item to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newQuantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Successfully updated the cart item quantity.
 *       400:
 *         description: Invalid data or cart item not found.
 */
        this.router.put('/:id/cart_item_quantity', userAuth,isUser, this.cartController.updateCart);

        /**
 * @openapi
 * /api/v1/{id}/remove_cart_item:
 *   delete:
 *     tags:
 *       - Cart
 *     description: Remove a specific item from the user's cart.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart item to remove.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully removed the cart item.
 *       400:
 *         description: Cart item not found or authorization error.
 */
        this.router.delete('/:id/remove_cart_item',this.CartValidator.removeBookValid,userAuth,isUser, this.cartController.removeFromCart);
    }
    public getRoutes=(): IRouter => {
        return this.router;
    }
}
export default cartRoutes;