import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { AuthGuard } from 'src/libs/core/guards/jwt-auth.guard';
import { FastifyRequest } from 'fastify';
import { DecodedUser } from 'src/libs/core/interfaces/decoded.interface';
import { CreateProjectDto } from '../dtos/project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  async createProject(
    @Body() body: CreateProjectDto,
    @Request() req: FastifyRequest & { decoded: DecodedUser },
  ) {
    return await this.projectService.createProject(body, req.decoded.id);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  async getAllProjects(
    @Request() req: FastifyRequest & { decoded: DecodedUser },
  ) {
    return await this.projectService.getAllProjects(req.decoded.id);
  }

  @Get('/tasks')
  @UseGuards(AuthGuard)
  async getProjectWithTasks(
    @Request() req: FastifyRequest & { decoded: DecodedUser },
  ) {
    return await this.projectService.getProjectWithTasks(req.decoded.id);
  }
}
