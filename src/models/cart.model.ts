import { Sequelize, Model, DataTypes } from "sequelize";
import { ICart } from "../interfaces/cart.interface"; 

export default (sequelize: Sequelize,DataTypes) => {
  class Cart extends Model<ICart> implements ICart {
    public book_id!: number;
    public user_id!: number;
    public quantityBook!: number;
    public total_price!: number;
  }

  Cart.init(
    {
      book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantityBook: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "cart",
     
    }
  );

  return Cart;
};
