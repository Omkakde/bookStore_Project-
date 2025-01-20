import Joi from "@hapi/joi";
import { Request, Response, NextFunction } from "express";

export class CartValidator {
    public addBookValid(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            quantity: Joi.number().required()
        });
        const paramSchema = Joi.object({
            id: Joi.number().required().positive()
        });
        try {
            schema.validate(req.body);
            paramSchema.validate(req.params);
            next();
        } catch (error) {
            next(error);
        }
    }

    public removeBookValid(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            newQuantity: Joi.number().required()
        });
        const paramSchema = Joi.object({
            id: Joi.number().required().positive()
        });
        try {
            schema.validate(req.body);
            paramSchema.validate(req.params);
            next();
        } catch (error) {
            next(error);
        }
    }
}