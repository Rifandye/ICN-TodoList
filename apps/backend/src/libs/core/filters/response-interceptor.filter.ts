import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.inteface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, T | ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | ApiResponse<T>> {
    if (context.getType<'graphql'>() === 'graphql') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: 'Request successful',
        data,
      })),
    );
  }
}
