import Joi from "@hapi/joi";
import { Request, Response, NextFunction } from "express";

export class UserValidator {
    public registrationValid(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required().length(10),
            role: Joi.string().required(),
            password: Joi.string().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            throw error;
        }
        next();

    }

    public loginValid(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
        });
        const {error} = schema.validate(req.body);
        if(error){
            throw error;
        }
        next();
    }
    
    public refreshTokenValid(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            refreshtoken: Joi.string().required()
        });
        const {error} = schema.validate(req.body);
        if(error){
            throw error;
        }
        next();
    }

    public forgotPassValid(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            email: Joi.string().required()
        });
        const {error} = schema.validate(req.body);
        if(error){
            throw error;
        }
        next();
    }

    public resetPassValid(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            newPassword: Joi.string().required()
        });
        const {error} = schema.validate(req.body);
        if(error){
            throw error;
        }
        next();
    }
}