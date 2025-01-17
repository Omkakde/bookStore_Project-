import dotenv from "dotenv";
import sequelize, { DataTypes } from '../config/database';
import { IBook } from './../interfaces/book.interface';
import Books from '../models/book.model';
dotenv.config();
import { Request } from "express-serve-static-core";


class bookServices{
    private Book = Books(sequelize, DataTypes);


  
    public addBook = async (body:IBook) => {
      try {
        const newBook = await this.Book.create(body);
        return newBook;
      } catch (error) {
        console.error("Error while adding book:", error.message || error);
        throw new Error(`Failed to create Book: ${error.message}`);
      }
    };
    
    

    public getAllBooks = async () => {
        try {
            const books = await this.Book.findAll();
            if (!books || books.length === 0) {
                throw new Error('No books found in the database');
            }
            return {
                success: true,
                data: books,
                message: 'Books retrieved successfully',
                source: 'Data retrieved from database',
            };
        } catch (error) {
            console.error('Error fetching books:', error.message);
            throw new Error('An error occurred while fetching books from the database');
        }
    };

    
    public getByBookId = async (bookId) => {
        try {
        const data = await this.Book.findAll({where:{ id:bookId}});
         if (!data || data.length === 0) {
            throw new Error('Book not found');
          }
        return data;
    } catch (error) {
        console.error('Error in getBookById:', error);
        throw error;
    }
    }
    public updateBookById = async (req: Request) => {
      try {
          const bookId = req.params.id; 
          const adminUserId = req.body.admin_user_id; 
          if (!adminUserId) {
              throw new Error('Admin user ID is required');
          }
          const present = await this.Book.findOne({  where: { id: bookId, admin_user_id: adminUserId },});
  
          if (!present) {
              throw new Error('Book does not exist');
          }
          const data = await this.Book.update(req.body, {
              where: { admin_user_id: adminUserId, id: bookId },
          });
          return data;
      } catch (error) {
          console.error('Error updating book:', error.message || error);
          throw new Error(`Error: ${error.message || 'Failed to update book'}`);
      }
  };
  

    public deleteBooksById = async (req) => {
        try {
        const id = req.params.id;
        const present = await this.Book.findOne({where:{id: id}});
        if(!present){
          throw new Error('Book not found');
        }
        const data = await this.Book.destroy({where: {id: id}});
      } catch (error) {
        throw error;
      }
      }

    


}export default bookServices;