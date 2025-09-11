import { Module } from '@nestjs/common';
import { JwtConfigModule } from 'src/libs/jwt/jwt.module';
import { TaskModule } from './modules/task/task.module';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [JwtConfigModule, TaskModule, ProjectModule],
})
export class TodoModule {}
