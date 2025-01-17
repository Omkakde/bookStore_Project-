import express from "express";
import bookServices from  '../services/book.service';
import { Request,Response, NextFunction } from "express-serve-static-core";
import httpStatus from 'http-status-codes';

class bookControllers{
    public bookServices = new bookServices();


    public addBook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newBook = await this.bookServices.addBook(req.body);
            res.status(httpStatus.CREATED).json({
                code: httpStatus.CREATED,
                message: "Book add successfully",
                data: newBook,
            });
        } catch (error) {
            console.error(`Cannot create Book:`, error);
            next({
                code: httpStatus.INTERNAL_SERVER_ERROR,
                message: "Failed to create Book",
                error: (error as Error).message,
            });
        }
    }

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try{
            let books = await this.bookServices.getAllBooks();
            res.status(httpStatus.OK).json(books);
        } catch(error){
            console.error('Error retrieving books:', error);
            next(error);
        }
    }

    public getByBookId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;
            const book = await this.bookServices.getByBookId(userId);
            res.status(httpStatus.OK).json(book);
        } catch (error) {
            console.error('Error retrieving book:', error);
            next({
                code: httpStatus.INTERNAL_SERVER_ERROR,
                message: 'Error retrieving book',
                error: (error as Error).message,
            });
        }
    };

    public deleteBook = async(req:Request, res:Response, next:NextFunction)=>{
        try{
            this.bookServices.deleteBooksById(req);
            res.status(httpStatus.OK).json({
                code: httpStatus.OK,
                message: 'Book permanently deleted',
               
            });
        }catch(error){
            next(error);
        }
    }

    public updatePrice = async (req: Request, res: Response, next: NextFunction) => { 
        try {
            let updated = await this.bookServices.updateBookById(req);  
            if (updated) {
                res.status(httpStatus.OK).json({
                    code: httpStatus.OK,
                    message: 'Book price updated',
                });
            } else {
                res.status(httpStatus.NOT_FOUND).json({
                    code: httpStatus.NOT_FOUND,
                    message: 'Book not found or not updated',
                });
            }
        } catch (error) {
            next(error);
        }
    };
    
    
    public updateQuantity = async (req: Request, res: Response, next: NextFunction) => {
        try{
            let check = await this.bookServices.updateBookById(req);
            if (check) {
                res.status(httpStatus.OK).json({
                    code: httpStatus.OK,
                    message: 'Book quantity updated',
                });
            } else {
                res.status(httpStatus.NOT_FOUND).json({
                    code: httpStatus.NOT_FOUND,
                    message: 'Book not found or not updated',
                });
            }


        } catch(error){
            next(error);
        }
    }
    


}export default bookControllers;