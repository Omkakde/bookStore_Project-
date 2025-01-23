import { IBook } from "../interfaces/book.interface";
import  wishlist  from "../models/wishlist.model";
import Books from "../models/book.model";
import sequelize, { DataTypes } from '../config/database';

export class WishlistServices {
     private wishlist = wishlist(sequelize, DataTypes);
     private book = Books(sequelize, DataTypes);

     public addBook = async (req) => {
        const userId = req.body.admin_user_id;
        const bookId = req.body.id;
    
        try {
            const bookExist = await this.book.findOne({ 
                where: { id: bookId } 
            });
    
            if (!bookExist) {
                throw new Error(`Book with ID ${bookId} doesn't exist in the database`);
            }
    
            let userWishlist = await this.wishlist.findOne({
                where: { user_id: userId }
            });
    
            if (userWishlist) {
                const currentBooks = userWishlist.getDataValue('books') || [];
    
                const existingBookIndex = currentBooks.findIndex(
                    (item: IBook) => item.id === bookId
                );
    
                let updatedBooks;
    
                if (existingBookIndex !== -1) {
                    throw new Error(`Book with ID ${bookId} is already in the wishlist`);
                } else {
                    updatedBooks = [
                        ...currentBooks,
                        bookExist
                    ];
                }
    
                await userWishlist.update({
                    books: updatedBooks
                });
    
            } else {
                await this.wishlist.create({
                    user_id: userId,
                    books: [bookExist]
                });
            }
        } catch (error) {
            console.error('Error in addBook method:', error.message);
            throw new Error(`An error occurred while adding the book: ${error.message}`);
        }
    };
    


    public  removeBook= async(req)=> {
        const userId = req.body.admin_user_id;
        const book_id= parseInt(req.params.id);
        const userWishlist = await this.wishlist.findOne({ 
            where: { user_id: userId }
        });
    
        if (!userWishlist) {
            throw Error(`There is no wishlist for user with id ${userId}`);
        }
    
        const currentBooks = userWishlist.getDataValue('books') || [];
        
        const bookIndex = currentBooks.findIndex(
            (item: IBook) => item.id === book_id
        );
    
        if (bookIndex === -1) {
            throw Error(`There is no book in this wishlist with id ${book_id}`);
        }
    
        let updatedBooks = currentBooks.filter(
                (item: IBook) => item.id !== book_id
            );
    
        await userWishlist.update({
            books: updatedBooks,
        });
    
        if (updatedBooks.length === 0) {
            await userWishlist.destroy();
        }
    }

    public  getWishlist = async(req) =>{
        const userId = req.body.admin_user_id;
        const wishlistExist = await this.wishlist.findOne({ where: { user_id: userId } });
        if (!wishlistExist) {
            throw Error(`there is no wishlist for user with id ${userId}`);
        }
        return wishlistExist.dataValues;
    }
}