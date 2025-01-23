import Joi from "@hapi/joi";
import { Request, Response, NextFunction } from "express";

export class WishlistValidator {
    public addBookValid(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            id: Joi.number().required().positive()
        });
        try {
            const { error } = schema.validate(req.params);
            if (error) {
                throw error;
            }
            next();
        } catch (error) {
            next({ error, status: 401 });
        }
    }

    public removeBookValid(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            id: Joi.number().required().positive()
        });
        try {
            const { error } = schema.validate(req.params);
            if (error) {
                throw error;
            }
            next();
        } catch (error) {
            next({ error, status: 401 });
        }
    }
}