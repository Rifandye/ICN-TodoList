import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto, LoginDto } from '../dtos/auth.dto';
import { DecodedUser } from 'src/libs/core/interfaces/decoded.interface';
import { AuthGuard } from 'src/libs/core/guards/jwt-auth.guard';
import { FastifyRequest } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: CreateUserDto) {
    return await this.authService.createUser(body);
  }

  @Post('/login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async userProfile(@Request() req: FastifyRequest & { decoded: DecodedUser }) {
    return await this.authService.userProfile(req.decoded.id);
  }
}
