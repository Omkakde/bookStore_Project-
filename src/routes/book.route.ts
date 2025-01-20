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

        this.router.get('/', this.bookController.getAll);  
        this.router.get('/:id',this.redisCache.getBookById, this.bookController.getByBookId);  
        this.router.delete('/id', userAuth, isAdmin,this.bookController.deleteBook);
        this.router.post('/',userAuth,this.BookValidator.bookCreateValid ,isAdmin,this.bookController.addBook);
        this.router.put('/:id/updatePrice',this.BookValidator.bookUpdateValid,userAuth, isAdmin,this.bookController.updatePrice);
        this.router.put('/:id/updateQuantity',userAuth, isAdmin,this.bookController.updateQuantity);
        
    };

    public getRoutes = (): IRouter => {
        return this.router;
    };
}

export default bookRoutes;
