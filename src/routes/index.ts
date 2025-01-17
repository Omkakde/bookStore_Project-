import express, { IRouter } from 'express';
const router = express.Router();

import userRoutes from './user.route';
import bookRoutes from './book.route';

const routes = (): IRouter => {
  router.get('/', (req, res) => {
    res.json('Welcome to E-BookStore');
  });
  router.use('/users', new userRoutes().getRoutes());
  router.use('/books', new bookRoutes().getRoutes());

  return router;
};

export default routes;
