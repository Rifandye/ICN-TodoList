import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ProjectTypeOrmEntity } from 'src/libs/typeorm/entities/project.typeorm-entity';
import { EntityManager, In, Repository } from 'typeorm';
import { CreateProjectDto } from '../dtos/project.dto';
import { CreateTaskDto } from '../../task/dtos/task.dto';
import { TaskTypeOrmEntity } from 'src/libs/typeorm/entities/task.typeorm-entity';
import { TaskStatus } from '../../task/enums/task.enum';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectTypeOrmEntity)
    private readonly projectRepository: Repository<ProjectTypeOrmEntity>,

    @InjectRepository(TaskTypeOrmEntity)
    private readonly taskRepository: Repository<TaskTypeOrmEntity>,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getAllProjects(userId: string) {
    return await this.projectRepository.find({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getProjectWithTasks(userId: string) {
    const projects = await this.projectRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (projects.length === 0) {
      return [];
    }

    const projectIds = projects.map((p) => p.id);

    const tasks = await this.taskRepository.find({
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        parentTaskId: true,
        projectId: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { projectId: In(projectIds) },
      order: { createdAt: 'ASC' },
    });

    const tasksByProject = new Map<string, TaskTypeOrmEntity[]>();
    for (const task of tasks) {
      if (task.projectId) {
        if (!tasksByProject.has(task.projectId)) {
          tasksByProject.set(task.projectId, []);
        }
        tasksByProject.get(task.projectId)!.push({ ...task, subtasks: [] });
      }
    }

    for (const project of projects) {
      const projectTasks = tasksByProject.get(project.id) ?? [];
      const taskMap = new Map<string, TaskTypeOrmEntity>();
      projectTasks.forEach((task) => taskMap.set(task.id, task));

      const rootTasks: TaskTypeOrmEntity[] = [];
      for (const task of taskMap.values()) {
        if (task.parentTaskId) {
          const parent = taskMap.get(task.parentTaskId);
          if (parent) {
            parent.subtasks.push(task);
          }
        } else {
          rootTasks.push(task);
        }
      }

      project.tasks = rootTasks;
    }

    return projects;
  }

  async createProject(body: CreateProjectDto, userId: string) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { name, description, tasks } = body;

      const project = queryRunner.manager.create(ProjectTypeOrmEntity, {
        name,
        description,
        userId,
      });
      await queryRunner.manager.save(project);

      const createTaskWithSubtasks = async (
        taskDto: CreateTaskDto,
        projectId: string,
        parentTaskId?: string,
      ) => {
        const { title, description, subTask, priority, dueDate } = taskDto;

        const newTask = queryRunner.manager.create(TaskTypeOrmEntity, {
          title,
          description,
          projectId,
          parentTaskId: parentTaskId || null,
          status: TaskStatus.PENDING,
          priority,
          dueDate,
        });
        await queryRunner.manager.save(newTask);

        if (subTask && subTask.length > 0) {
          for (const subTaskDto of subTask) {
            await createTaskWithSubtasks(subTaskDto, projectId, newTask.id);
          }
        }
      };

      if (tasks && tasks.length > 0) {
        for (const task of tasks) {
          await createTaskWithSubtasks(task, project.id);
        }
      }

      await queryRunner.commitTransaction();
      return { message: 'Success Creating Project' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
