import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
// import { Request, Response } from 'express';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const data: { message: string[] } = exception.getResponse() as {
      message: string[];
    };

    console.log(typeof data);
    response.status(status).json({
      // statusCode: status,
      // timestamp: new Date().toISOString(),
      // path: request.url,
      // error: exception.message,
      // stack: exception.stack,
      message: data.message[0],
      data: null,
    });
  }
}
