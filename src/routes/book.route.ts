import express, { Router, IRouter } from 'express';
import bookControllers from '../controllers/book.controller';
import { userAuth,isAdmin } from '../middlewares/auth.middleware';

class bookRoutes {
    private bookController = new bookControllers();
    private router = express.Router();

    constructor() {
        this.routes();
    }

    public routes = () => {

        this.router.get('/', this.bookController.getAll);  
        this.router.get('/:id', this.bookController.getByBookId);  
        this.router.delete('/id', userAuth, isAdmin,this.bookController.deleteBook);
        this.router.post('/',userAuth, isAdmin,this.bookController.addBook);
        this.router.put('/:id/updatePrice',userAuth, isAdmin,this.bookController.updatePrice);
        this.router.put('/:id/updateQuantity',userAuth, isAdmin,this.bookController.updateQuantity);
        
    };

    public getRoutes = (): IRouter => {
        return this.router;
    };
}

export default bookRoutes;
