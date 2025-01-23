import Joi from "@hapi/joi";
import { Request, Response, NextFunction } from "express";

export class BookValidator {
    public bookCreateValid(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            description: Joi.string().required(),
            discount_price: Joi.number().required(),
            book_image: Joi.optional(),
            admin_user_id: Joi.number().required(),
            book_name: Joi.string().required(),
            author: Joi.string().required(),
            quantity: Joi.number().required(),
            price: Joi.number().required()
        });
        try {
            schema.validate(req.body);
            next();
        } catch (error) {
            next(error);
        }
    }

    public bookUpdateValid(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            price: Joi.number().optional(),
            book_image: Joi.string().optional()
        });
        const paramSchema = Joi.object({
            id: Joi.number().required()
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