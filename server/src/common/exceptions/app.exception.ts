import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorCode } from "../enums/error.code";

export class AppException extends HttpException{
    constructor(
        message:string,
        statusCode: HttpStatus,
        errorCode: ErrorCode,
        errors?: string[],
    ){
        super(
            {
                message,
                errorCode,
                errors
            },
            statusCode
        );
    };
}