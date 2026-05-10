import { registerAs } from "@nestjs/config";

export const rmqConfig= registerAs('rmq',()=>({
    url: process.env.RABBITMQ_URI || 'amqp://admin:admin123@rabbitmq:5672'
}))