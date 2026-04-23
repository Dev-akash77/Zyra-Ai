import { Inject, Injectable } from "@nestjs/common";
import { injection_token } from "../../constants/injection.token";
import { MyLoggerService } from "../logger/logger.service";
import { type Transporter } from 'nodemailer';


export class MailService {
    constructor(
    @Inject(injection_token.NODEMAILER_CONNECTION)
    private readonly transpoter: Transporter,
     private readonly logger: MyLoggerService,
){}

 // send mail
 async sendMail(to: string, subject: string, html: string) {
    return this.transpoter.sendMail({
        
    })
 }
} 