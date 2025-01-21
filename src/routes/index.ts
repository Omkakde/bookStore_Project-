import express, { IRouter } from 'express';
const router = express.Router();
import userRoutes from './user.route';
import bookRoutes from './book.route';
import bookCarts from './cart.route';
import wishListRoutes from './wishlist.route';
import orderRoutes from './order.route';
const routes = (): IRouter => {
  router.get('/', (req, res) => {
    res.json('Welcome to E-BookStore');
  });
  router.use('/users', new userRoutes().getRoutes());
  router.use('/books', new bookRoutes().getRoutes());
  router.use('/cart', new bookCarts().getRoutes());
  router.use('/wishlist', new wishListRoutes().getRoutes());
  router.use('/order',new orderRoutes().getRoutes());
  return router;
};

export default routes;
