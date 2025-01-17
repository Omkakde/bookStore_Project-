import express, { IRouter } from 'express';
import userController from '../controllers/user.controller';
import userValidator from '../validators/user.validator';
import { userAuth } from '../middlewares/auth.middleware';

class UserRoutes {
  private UserController = new userController();
  private router = express.Router();
  private UserValidator = new userValidator();

  constructor() {
    this.routes();
  }

  private routes = () => {

  
    this.router.post('/',this.UserController.newUser);
    this.router.post('/login', this.UserController.login);
    this.router.post('/refreshtoken',this.UserController.refreshToken);
    this.router.post('/forgotpassword',this.UserController.forgotPass);
    this.router.post('/resetpassword',userAuth,this.UserController.resetPass);


    
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
