import User from './user.model';
import Book from './book.model';
import sequelize,{DataTypes} from '../config/database';

const user = User(sequelize, DataTypes);
const book = Book(sequelize, DataTypes);


user.hasMany(book, {
    foreignKey: 'admin_user_id',
    as: 'user_book_association'
});

export {user, book};