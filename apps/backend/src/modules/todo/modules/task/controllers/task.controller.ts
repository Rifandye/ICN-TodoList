import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Request,
  UseGuards,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { FastifyRequest } from 'fastify';
import { DecodedUser } from 'src/libs/core/interfaces/decoded.interface';
import { AuthGuard } from 'src/libs/core/guards/jwt-auth.guard';
import { CreateTaskDto, TaskSuggestionDto } from '../dtos/task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async getAllTasks(@Request() req: FastifyRequest & { decoded: DecodedUser }) {
    return await this.taskService.getAllTasks(req.decoded.id);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getTaskById(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: FastifyRequest & { decoded: DecodedUser },
  ) {
    return await this.taskService.getTaskById(id, req.decoded.id);
  }

  @Post('/')
  @UseGuards(AuthGuard)
  async createTask(
    @Body() dto: CreateTaskDto,
    @Request() req: FastifyRequest & { decoded: DecodedUser },
  ) {
    return await this.taskService.createTask(
      dto,
      req.decoded.id,
      dto.projectId,
      dto.parentTaskId,
    );
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  async updateTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateTaskDto>,
    @Request() req: FastifyRequest & { decoded: DecodedUser },
  ) {
    return await this.taskService.updateTask(id, req.decoded.id, dto);
  }

  @Delete('/:id/delete')
  @UseGuards(AuthGuard)
  async deleteTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: FastifyRequest & { decoded: DecodedUser },
  ) {
    return await this.taskService.deleteTask(id, req.decoded.id);
  }

  @Post('/suggestions')
  @UseGuards(AuthGuard)
  async generateTaskSuggestions(@Body() body: TaskSuggestionDto) {
    const suggestions = await this.taskService.generateTaskSuggestions(
      body.userInput,
    );

    return {
      userInput: body.userInput,
      suggestions,
    };
  }
}
