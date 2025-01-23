import User from './user.model';
import Book from './book.model';
import Cart from './cart.model';
import Wishlist from './wishlist.model';
import sequelize,{DataTypes} from '../config/database';

const user = User(sequelize, DataTypes);
const book = Book(sequelize, DataTypes);
const cart = Cart(sequelize ,DataTypes);
const wishlist = Wishlist(sequelize,DataTypes);

user.hasMany(book, {
    foreignKey: 'admin_user_id',
    as: 'user_book_association'
});

user.hasOne(cart, {
    foreignKey: 'user_id',
    as: 'user_cart_association'
});

wishlist.belongsTo(user, 
    { foreignKey: 'user_id',
      as: 'user'
     });

export {user, book, cart, wishlist};