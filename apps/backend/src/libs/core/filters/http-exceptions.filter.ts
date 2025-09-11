import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import {
  ErrorApiResponse,
  NestResponse,
} from '../interfaces/api-response.inteface';
import { FastifyReply } from 'fastify/types/reply';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    if (host.getType() !== 'http') return;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();

    const responseData = exception.getResponse() as NestResponse;

    const ApiResponse: ErrorApiResponse = {
      success: false,
      message: responseData.error,
      error: {
        code: status,
        details: [responseData.message],
      },
    };

    response.status(status).send(ApiResponse);
  }
}
