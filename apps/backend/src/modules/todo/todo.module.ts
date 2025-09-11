import { Module } from '@nestjs/common';
import { TodoService } from './services/todo.service';
import { TodoController } from './controllers/todo.controller';
import { JwtConfigModule } from 'src/libs/jwt/jwt.module';

@Module({
  imports: [JwtConfigModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
