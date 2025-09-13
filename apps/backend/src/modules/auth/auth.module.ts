import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from 'src/libs/typeorm/entities/user.typeorm-entity';
import { JwtConfigModule } from 'src/libs/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntity]), JwtConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
