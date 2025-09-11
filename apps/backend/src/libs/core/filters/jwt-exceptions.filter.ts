import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ErrorApiResponse } from '../interfaces/api-response.inteface';
import { FastifyReply } from 'fastify/types/reply';
import { JsonWebTokenError } from '@nestjs/jwt';

@Catch(JsonWebTokenError)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: JsonWebTokenError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const ApiResponse: ErrorApiResponse = {
      success: false,
      message: exception.name,
      error: {
        code: 401,
        details: [exception.message],
      },
    };

    response.status(401).send(ApiResponse);
  }
}
