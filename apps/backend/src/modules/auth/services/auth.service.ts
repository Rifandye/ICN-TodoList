import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDto } from '../dtos/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from 'src/libs/typeorm/entities/user.typeorm-entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly userRepository: Repository<UserTypeOrmEntity>,

    private readonly jwtService: JwtService,
  ) {}

  private async validateExisitingUser(userName: string) {
    const user = await this.userRepository.findOne({
      where: { userName },
    });

    if (user) throw new BadRequestException('User Already Exist');

    return;
  }

  private async hashUserPassword(password: string) {
    const hashedPassowrd = await bcrypt.hash(password, 10);
    return hashedPassowrd;
  }

  private async comparePass(
    recordedPassword: string,
    incomingPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(incomingPassword, recordedPassword);
  }

  async createUser(payload: CreateUserDto) {
    const { username, password, fullName } = payload;

    await this.validateExisitingUser(username);

    const hashedPassowrd = await this.hashUserPassword(password);

    const createdUser = this.userRepository.create({
      userName: username,
      password: hashedPassowrd,
      fullName,
    });

    await this.userRepository.save(createdUser);

    return { message: 'Creating User Success' };
  }

  async login(payload: LoginDto) {
    const { username, password } = payload;

    const user = await this.userRepository.findOne({
      where: { userName: username },
    });

    if (!user) throw new BadRequestException('User Not Registed');

    const isPasswordValid = await this.comparePass(user.password, password);

    if (!isPasswordValid) throw new BadRequestException('Incorrect Password');

    const accessToken = this.jwtService.sign({
      id: user.id,
      name: user.fullName,
    });

    return { accessToken };
  }
}
