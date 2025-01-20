import { IBook } from "../interfaces/book.interface";
import  wishlist  from "../models/wishlist.model";
import { book } from "../models";
import { DataTypes, Sequelize } from "sequelize";


export class WishlistServices {
     private wishlist = wishlist(Sequelize, DataTypes);
     
    public async addBook(body: { user_id: number, book_id: number}) {
        const bookExist = await book.findOne({ 
            where: { id: body.book_id },
            raw: true
        });
        
        if (!bookExist) {
            throw Error(`Book doesn't exist in the database`);
        }
        
        let userWishlist = await this.wishlist.findOne({ 
            where: { user_id: body.user_id }
        });
    
        if (userWishlist) {
            const currentBooks = userWishlist.getDataValue('books') || [];
            
            const existingBookIndex = currentBooks.findIndex(
                (item: IBook) => item.id === body.book_id
            );
            
            let updatedBooks;
            if (existingBookIndex !== -1) {
                throw Error(`book already exist in wishlist`);
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
                user_id: body.user_id,
                books: [bookExist]
            });
        }
    }


    public async removeBook(body: { user_id: number, book_id: number}) {

        const userWishlist = await this.wishlist.findOne({ 
            where: { user_id: body.user_id }
        });
    
        if (!userWishlist) {
            throw Error(`There is no wishlist for user with id ${body.user_id}`);
        }
    
        const currentBooks = userWishlist.getDataValue('books') || [];
        
        const bookIndex = currentBooks.findIndex(
            (item: IBook) => item.id === body.book_id
        );
    
        if (bookIndex === -1) {
            throw Error(`There is no book in this wishlist with id ${body.book_id}`);
        }
    
        let updatedBooks = currentBooks.filter(
                (item: IBook) => item.id !== body.book_id
            );
    
        await userWishlist.update({
            books: updatedBooks,
        });
    
        if (updatedBooks.length === 0) {
            await userWishlist.destroy();
        }
    }

    public async getWishlist(body: { user_id: number }) {
        const wishlistExist = await this.wishlist.findOne({ where: { user_id: body.user_id } });
        if (!wishlistExist) {
            throw Error(`there is no wishlist for user with id ${body.user_id}`);
        }
        return wishlistExist.dataValues;
    }
}