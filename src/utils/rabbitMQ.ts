import amqp from 'amqplib';
import Logger from '../config/logger';

let channel: amqp.Channel;
export async function connectToRabbitMQ(){
   try{
    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
   }
   catch(error){
    console.error('Error connecting to RabbitMQ:', error);
   }
}

export async function sendToQueue(queueName: string, data: any){
    try{
        if(!channel){
            console.log('RabbitMQ channel is not initialized.');
            return;
        }
        await channel.assertQueue(queueName);
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
        console.log('Message sent to RabbitMQ:', data);
    }catch(error){
        console.error('Error sending data to RabbitMQ:', error);
    }
}