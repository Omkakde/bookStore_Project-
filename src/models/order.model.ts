import { Model, DataTypes, Sequelize } from "sequelize";
import { IOrder } from '../interfaces/order.interface';

export default (sequelize: Sequelize,  DataTypes) => {
  class Orders extends Model<IOrder> implements IOrder {
    public user_id!: number; 
    public items!: []; 
    public total_price!: number;
    public order_date!: Date; 
  }

  Orders.init(
    {
     
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      items: {
        type: DataTypes.JSON, 
        allowNull: false,
        defaultValue: [],
      },
      total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      order_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
        sequelize,
        modelName: 'orders',
        timestamps: false, 
    }
  );

  return Orders;
};
