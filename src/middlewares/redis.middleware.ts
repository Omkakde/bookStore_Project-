import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";

class RedisMiddleware {

    public getBooks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const books = await redisClient.lRange('books:list', 0, -1); 
            if (books.length > 0) {
               return res.status(200).json({
                    success: true,
                    data: books.map((book) => JSON.parse(book)), 
                    message: 'Fetched from cache',
                });
            } else {
                next(); 
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };

    public getBookById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bookId = req.params.id;
            const books = await redisClient.lRange('books:list', 0, -1); 
            const book = books.find((b) => JSON.parse(b).id.toString() === bookId); 

            if (book) {
                return res.status(200).json({
                    success: true,
                    data: JSON.parse(book),
                    message: 'Book retrieved successfully from cache',
                    source: 'Cache',
                });
            }
            next(); 
        } catch (error) {
            console.error("Error retrieving book by ID:", error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };
}

export default  RedisMiddleware;
