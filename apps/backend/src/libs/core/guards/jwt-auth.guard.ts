import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { DecodedUser } from '../interfaces/decoded.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request: FastifyRequest | undefined;

    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest<FastifyRequest>();
    }

    if (!request)
      throw new UnauthorizedException('Request object is undefined');

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('No token provided');

    const payload = await this.jwtService.verifyAsync<DecodedUser>(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    if (!payload) throw new UnauthorizedException('Invalid or expired token');

    request['decoded'] = payload;

    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const authHeader = request.headers?.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type?.toLowerCase() === 'bearer' ? token : undefined;
  }
}
