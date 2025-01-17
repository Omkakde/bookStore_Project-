import { Sequelize, Model } from "sequelize";
import { IUser } from "../interfaces/user.interface";

export default (sequelize: Sequelize, DataTypes) => {
    class User extends Model<IUser> implements IUser {
        public name;
        public email;
        public phone;
        public role;
        public password;
        public refreshToken;
    }

    User.init({
        
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.NUMBER,
        role: DataTypes.STRING,
        password: DataTypes.STRING,
        refreshToken: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'users'
    });
    return User;
}