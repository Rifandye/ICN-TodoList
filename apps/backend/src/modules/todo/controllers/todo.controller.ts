import { Controller } from '@nestjs/common';
import { TodoService } from '../services/todo.service';

@Controller()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
}
