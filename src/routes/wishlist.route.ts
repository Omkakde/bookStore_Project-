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
        /**
 * @openapi
 * /api/v1/wishlist/{id}/addBook:
 *   post:
 *     tags:
 *       - WishList
 *     description: Add a book to the user's wishlist.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the wishlist to add the book to.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Book successfully added to the wishlist.
 *       400:
 *         description: Invalid data or wishlist not found.
 */
        this.router.post('/:id/addBook',this.WishlistValidator.addBookValid ,userAuth,isUser,this.WishListController.addToWishList);

        /**
 * @openapi
 * /api/v1/wishlist/{id}/removeBook:
 *   delete:
 *     tags:
 *       - WishList
 *     description: Remove a book from the user's wishlist.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to remove from the wishlist.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book successfully removed from the wishlist.
 *       400:
 *         description: Book not found in wishlist or authorization error.
 */
        this.router.delete('/:id/removeBook',this.WishlistValidator.removeBookValid,userAuth, isUser, this.WishListController.removeBook);
        
        /**
 * @openapi
 * /api/v1/getAll:
 *   get:
 *     tags:
 *       - WishList
 *     description: Retrieve all books in the user's wishlist.
 *     responses:
 *       200:
 *         description: Successfully retrieved wishlist.
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
 *                   example: "Wishlist retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     books:
 *                       type: array
 *                       items:
 *                         type: object
 *                         additionalProperties: true  # Allows any properties within the book objects
 *       400:
 *         description: Failed to retrieve wishlist or authorization error.
 */
        this.router.get('/getAll', userAuth,isUser, this.WishListController.getAllBook);
    }
     public getRoutes=(): IRouter => {
            return this.router;
        }

}
export default wishListRoutes;