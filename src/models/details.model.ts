import IDetails from "../interfaces/details.interface";
import { Sequelize, Model, DataTypes } from "sequelize";


export default (sequelize: Sequelize,DataTypes) => {
    class Details extends Model<IDetails> implements IDetails{
        public user_Id:number;
        public fullAddress: string;
        public city: string;
        public state: string;
    }
    Details.init(
    {
        user_Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fullAddress:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        city:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        state:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        },
        {
            sequelize,
            modelName: "details",
           
    });
    return Details;
};
