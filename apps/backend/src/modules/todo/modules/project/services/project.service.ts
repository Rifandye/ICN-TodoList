import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectTypeOrmEntity } from 'src/libs/typeorm/entities/project.typeorm-entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from '../dtos/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectTypeOrmEntity)
    private readonly projectRepository: Repository<ProjectTypeOrmEntity>,
  ) {}

  async createProject(body: CreateProjectDto, userId: string) {
    const { name, description } = body;
    const project = this.projectRepository.create({
      name,
      description,
      userId,
    });
    await this.projectRepository.save(project);

    return project;
  }
}
