import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
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

  @Delete('/:id/delete')
  @UseGuards(AuthGuard)
  async deleteTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: FastifyRequest & { decoded: DecodedUser },
  ) {
    return await this.taskService.deleteTask(id, req.decoded.id);
  }
}
