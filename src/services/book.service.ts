import dotenv from "dotenv";
import sequelize, { DataTypes } from '../config/database';
import { IBook } from './../interfaces/book.interface';
import Books from '../models/book.model';
dotenv.config();
import { Request } from "express-serve-static-core";
import redisClient from "../config/redis";

class bookServices{
    private Book = Books(sequelize, DataTypes);

    private cacheKey = "books:list";

    public addBook = async (body: IBook) => {
        try {
            const newBook = await this.Book.create(body);
            await redisClient.lPush(this.cacheKey, JSON.stringify(newBook));

            return {
                success: true,
                data: newBook,
                message: 'Book added successfully and cache updated',
            };
        } catch (error) {
            throw new Error(`Failed to create Book: ${error.message}`);
        }
    };

    public getAllBooks = async () => {
        try {
            const books = await this.Book.findAll();
            if (!books || books.length === 0) {
                throw new Error('No books found in the database');
            }
            await redisClient.del(this.cacheKey);

        for (const book of books) {
            await redisClient.lPush(this.cacheKey, JSON.stringify(book));
        }
            return {
                success: true,
                data: books,
                message: 'Books retrieved successfully from database',
                source: 'Database',
            };
        } catch (error) {
            throw new Error('An error occurred while fetching books from the database');
        }
    };

    public getByBookId = async (bookId: string) => {
        try {
            const book = await this.Book.findOne({ where: { id: bookId } });
            if (!book) {
                throw new Error('Book not found');
            }
            return {
                success: true,
                data: book,
                message: 'Book retrieved successfully from database',
                source: 'Database',
            };
        } catch (error) {
            throw error;
        }
    };

    public updateBookById = async (req: Request) => {
        try {
            const bookId = req.params.id;
            const adminUserId = req.body.admin_user_id;

            if (!adminUserId) {
                throw new Error('Admin user ID is required');
            }
            const present = await this.Book.findOne({ where: { id: bookId, admin_user_id: adminUserId } });
            if (!present) {
                throw new Error('Book does not exist');
            }

            await this.Book.update(req.body, {
                where: { admin_user_id: adminUserId, id: bookId },
            });
            const updatedBook = await this.Book.findOne({ where: { id: bookId } });
            await redisClient.lRem(this.cacheKey, 0, JSON.stringify(present));
            await redisClient.lPush(this.cacheKey, JSON.stringify(updatedBook)); 

            return {
                success: true,
                message: 'Book updated successfully and cache refreshed',
            };
        } catch (error) {
            throw new Error(`Error: ${error.message || 'Failed to update book'}`);
        }
    };

    public deleteBooksById = async (req: Request) => {
        try {
            const bookId = req.params.id;
            const present = await this.Book.findOne({ where: { id: bookId } });
            if (!present) {
                throw new Error('Book not found');
            }
            await this.Book.destroy({ where: { id: bookId } });
            await redisClient.lRem(this.cacheKey, 0, JSON.stringify(present));
            return {
                success: true,
                message: 'Book deleted successfully and cache updated',
            };
        } catch (error) {
            throw error;
        }
    };
}

export default bookServices;

