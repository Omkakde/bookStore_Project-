/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const userAuth = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    let bearerToken = req.header('Authorization');
    if (!bearerToken)
      throw {
        code: HttpStatus.BAD_REQUEST,
        message: 'Authorization token is required'
      };
      bearerToken = bearerToken.split(' ')[1];
    const { id, email ,role}: any = await jwt.verify(bearerToken,`${process.env.JWT_SECRET_ACCESS}`);
   
    req.body.admin_user_id = id; 
    req.body.email = email;
    req.body.role = role;
    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin =  async (req: Request,res: Response,next: NextFunction) =>{
  try {
   if(req.body.role!=='admin'){
    return res.status(403).json({massage:"Premission denied .Admins only"});
   }
    next();
  } catch (error) {
    next(error);
  }
}

export const isUser =  async (req: Request,res: Response,next: NextFunction) =>{
  try {
   if(req.body.role!=='user'){
    return res.status(403).json({massage:"Premission denied .Users only"});
   }
    next();
  } catch (error) {
    next(error);
  }
}