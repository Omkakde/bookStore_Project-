import express,{Router} from 'express';
import userService from '../services/user.service';
import HttpStatus from 'http-status-codes';
import { Response,Request,NextFunction } from 'express';

class userControllers{
   private userService = new userService();    
  
    public newUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const data = await this.userService.newUser(req.body);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        message: `registered Successfully!`
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: `${error}`});
    }
  };
  
  public login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const data = await this.userService.userLogin(req.body);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'Login successfully'
        });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: `${error}`})
    
    }
    
  };

   // refresh token controller
   public refreshToken = async(req:Request, res:Response, next: NextFunction)=>{
    try{
      await this.userService.refreshToken(req, res);
    }
    catch(error){
      next(error);
    }
  }
   
  public forgotPass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.userService.forgotPassword(req.body);
      res.status(200).json({
        message: 'token sent to mail'
      });
    } catch (error) {
      next(error);
    }
  };

  public resetPass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.userService.resetPassword(req.body);
      res.status(200).json({
        message: 'your password has been reset'
      });
    } catch (error) {
      next(error);
    }
  };

 
}
export default userControllers;