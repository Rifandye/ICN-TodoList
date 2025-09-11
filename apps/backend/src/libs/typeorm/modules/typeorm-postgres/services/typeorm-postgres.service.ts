import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmPostgresService {
  constructor(private readonly configService: ConfigService) {}

  static getTypeOrmEntities() {
    return [];
  }

  getPostgresConnection(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.getOrThrow<string>('DB_HOST'),
      port: this.configService.getOrThrow<number>('DB_PORT'),
      username: this.configService.getOrThrow<string>('DB_USERNAME'),
      password: this.configService.getOrThrow<string>('DB_PASSWORD'),
      database: this.configService.getOrThrow<string>('DB_NAME'),
      entities: TypeOrmPostgresService.getTypeOrmEntities(),
      autoLoadEntities: false,
      synchronize: false,
    };
  }
}
