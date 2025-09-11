import { Module } from '@nestjs/common';
import { TypeOrmPostgresModule } from './modules/typeorm-postgres/typeorm-postgres.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmPostgresService } from './modules/typeorm-postgres/services/typeorm-postgres.service';

@Module({
  imports: [
    TypeOrmPostgresModule,
    TypeOrmModule.forRootAsync({
      imports: [TypeOrmPostgresModule],
      inject: [TypeOrmPostgresService],
      useFactory: (typeormService: TypeOrmPostgresService) =>
        typeormService.getPostgresConnection(),
    }),
  ],
  providers: [],
  exports: [],
})
export class TypeOrmConfigModule {}
