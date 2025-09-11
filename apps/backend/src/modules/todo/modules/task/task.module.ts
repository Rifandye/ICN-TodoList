import { Module } from '@nestjs/common';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';
import { JwtConfigModule } from 'src/libs/jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskTypeOrmEntity } from 'src/libs/typeorm/entities/task.typeorm-entity';

@Module({
  imports: [JwtConfigModule, TypeOrmModule.forFeature([TaskTypeOrmEntity])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
