import express, { Router, IRouter } from 'express';
import bookControllers from '../controllers/book.controller';
import { userAuth,isAdmin } from '../middlewares/auth.middleware';
import redisCache from './../middlewares/redis.middleware';
import { BookValidator } from '../validators/book.validator';
class bookRoutes {
    private bookController = new bookControllers();
    private router = express.Router();
    private redisCache = new redisCache();
    private BookValidator= new BookValidator();
    constructor() {
        this.routes();
    }

    public routes = () => {
/**
 * @openapi
 * /api/v1/books:
 *   get:
 *     tags:
 *       - Book
 *     description: Retrieve a list of all books.
 *     responses:
 *       200:
 *         description: Successfully retrieved books.
 *       400:
 *         description: Failed to retrieve books or no books found.
 */
        this.router.get('/',this.redisCache.getBooks ,this.bookController.getAll);
        
        /**
 * @openapi
 * /api/v1/books/{id}:
 *   get:
 *     tags:
 *       - Book
 *     description: Retrieve details of a specific book by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved the book details.
 *       400:
 *         description: Book not found or error retrieving the book.
 */
        this.router.get('/:id',this.redisCache.getBookById, this.bookController.getByBookId);  

        this.router.delete('/id', userAuth, isAdmin,this.bookController.deleteBook);

        /**
 * @openapi
 * /api/v1/books:
 *   post:
 *     tags:
 *       - Book
 *     description: Create a new book entry.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "ninjas"
 *               discount_price:
 *                 type: number
 *                 example: 14.99
 *               admin_user_id:
 *                 type: integer
 *                 example: 5
 *               book_name:
 *                 type: string
 *                 example: "Hollywood"
 *               author:
 *                 type: string
 *                 example: "Salman Khan"
 *               quantity:
 *                 type: integer
 *                 example: 10
 *               price:
 *                 type: number
 *                 example: 2000
 *     responses:
 *       201:
 *         description: Book created successfully.
 *       400:
 *         description: Invalid data or authorization error.
 */
        this.router.post('/',userAuth,this.BookValidator.bookCreateValid ,isAdmin,this.bookController.addBook);

        /**
 * @openapi
 * /api/v1/books/{id}/updatePrice:
 *   put:
 *     tags:
 *       - Book
 *     description: Update the price of a specific book.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 example: 888.00
 *     responses:
 *       200:
 *         description: Book price updated successfully.
 *       400:
 *         description: Invalid data or authorization error.
 */
        this.router.put('/:id/updatePrice',this.BookValidator.bookUpdateValid,userAuth, isAdmin,this.bookController.updatePrice);
        
        this.router.put('/:id/updateQuantity',userAuth, isAdmin,this.bookController.updateQuantity);
        
    };

    public getRoutes = (): IRouter => {
        return this.router;
    };
}

export default bookRoutes;
