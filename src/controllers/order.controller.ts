import express from 'express';
import { Request, Response, NextFunction, response } from 'express';
import { OrderServies } from './../services/order.service';
class orderControllers{
    private OrderServies = new OrderServies();

    public placeOrder = async (req:Request, res:Response, next:NextFunction)=>{
        try{
            let Order = await this.OrderServies.placeOrder(req);
            res.status(200).json({
                success: true,
                message: Order.message,
                order: Order.order,
              });
        }catch(error){
            res.status(500).json({
                success: false,
                message: "Failed to place order",
                error: error.message,
            });
        }
    };

    public getAllOrders = async (req:Request,res:Response, next:NextFunction)=>{
           try{
               const Order = await this.OrderServies.getOrders(req);
               if (!Order){
                res.status(400).json({
                    success: true,
                    message: "No orders found!",
                  });
               } 
               res.status(200).json({
                success: true,
                message: "Successfully get Orders",
                Orders:Order
               });

           }catch(error){
            res.status(500).json({
                success: false,
                message: "Failed to get orders",
                error: error.message,
            });
           }
    }
}
export default orderControllers;