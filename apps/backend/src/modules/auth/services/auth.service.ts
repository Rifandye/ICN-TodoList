import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor() {}

  async createUser(payload: CreateUserDto) {
    const { username, password, fullName } = payload;
  }
}
