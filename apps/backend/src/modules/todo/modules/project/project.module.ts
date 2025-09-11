import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { JwtConfigModule } from 'src/libs/jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTypeOrmEntity } from 'src/libs/typeorm/entities/project.typeorm-entity';

@Module({
  imports: [JwtConfigModule, TypeOrmModule.forFeature([ProjectTypeOrmEntity])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
