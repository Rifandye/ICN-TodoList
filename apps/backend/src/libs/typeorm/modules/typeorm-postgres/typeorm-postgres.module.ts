import { Module } from '@nestjs/common';
import { TypeOrmPostgresService } from './services/typeorm-postgres.service';

@Module({
  providers: [TypeOrmPostgresService],
  exports: [TypeOrmPostgresService],
})
export class TypeOrmPostgresModule {}
