import { Model} from 'sequelize';
import { IWishlist } from '../interfaces/wishList.interface';
import { IBook } from '../interfaces/book.interface';

export default (sequelize, DataTypes) => {
    class Wishlist extends Model<IWishlist> implements IWishlist{
        public user_id: number;
        public books: IBook[];
    }
    Wishlist.init({
        user_id: DataTypes.INTEGER,
        books: DataTypes.JSONB
    },{
        sequelize,
        modelName: 'wthis.wishlistishlists'
    });
    return Wishlist;
}