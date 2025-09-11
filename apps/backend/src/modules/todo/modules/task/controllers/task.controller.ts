import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { FastifyRequest } from 'fastify';
import { DecodedUser } from 'src/libs/core/interfaces/decoded.interface';
import { AuthGuard } from 'src/libs/core/guards/jwt-auth.guard';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async getAllTasks(@Request() req: FastifyRequest & { decoded: DecodedUser }) {
    return await this.taskService.getAllTasks(req.decoded.id);
  }
}
