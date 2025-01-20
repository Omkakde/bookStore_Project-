import express, { IRouter } from 'express';
import userController from '../controllers/user.controller';
import { userAuth } from '../middlewares/auth.middleware';
import { UserValidator } from './../validators/user.validator';

class UserRoutes {
  private UserController = new userController();
  private router = express.Router();
  private UserValidator = new UserValidator();

  constructor() {
    this.routes();
  }

  private routes = () => {

    this.router.post('/',this.UserValidator.registrationValid,this.UserController.newUser);
    this.router.post('/login',this.UserValidator.loginValid, this.UserController.login);
    this.router.post('/refreshtoken',this.UserValidator.refreshTokenValid,this.UserController.refreshToken);
    this.router.post('/forgotpassword',this.UserValidator.forgotPassValid,this.UserController.forgotPass);
    this.router.post('/resetpassword',this.UserValidator.resetPassValid,userAuth,this.UserController.resetPass);


    
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
