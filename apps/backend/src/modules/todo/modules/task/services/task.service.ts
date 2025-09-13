import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskTypeOrmEntity } from 'src/libs/typeorm/entities/task.typeorm-entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dtos/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskTypeOrmEntity)
    private readonly taskRepository: Repository<TaskTypeOrmEntity>,
  ) {}

  private async deleteSubtasksRecursive(task: TaskTypeOrmEntity) {
    if (task.subtasks && task.subtasks.length > 0) {
      for (const subtask of task.subtasks) {
        const subtaskEntity = await this.taskRepository.findOne({
          where: { id: subtask.id },
          relations: { subtasks: true },
        });
        if (subtaskEntity) {
          await this.deleteSubtasksRecursive(subtaskEntity);
        }
      }
    }
    await this.taskRepository.delete(task.id);
  }

  async getAllTasks(userId: string) {
    const tasks = await this.taskRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });

    const taskMap = new Map<string, TaskTypeOrmEntity>();
    tasks.forEach((task) => taskMap.set(task.id, { ...task, subtasks: [] }));

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

    return rootTasks;
  }

  async getTaskById(taskId: string, userId: string) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, userId },
      relations: { subtasks: true },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async createTask(
    dto: CreateTaskDto,
    userId: string,
    projectId?: string,
    parentTaskId?: string,
  ) {
    const newTask = this.taskRepository.create({
      ...dto,
      userId,
      projectId: projectId || null,
      parentTaskId: parentTaskId || null,
    });
    const savedTask = await this.taskRepository.save(newTask);

    if (dto.subTask && dto.subTask.length > 0) {
      for (const subDto of dto.subTask) {
        await this.createTask(subDto, userId, projectId, savedTask.id);
      }
    }

    return savedTask;
  }

  async updateTask(
    taskId: string,
    userId: string,
    dto: Partial<CreateTaskDto>,
  ) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, userId },
    });
    if (!task) throw new NotFoundException('Task not found');
    Object.assign(task, dto);
    return await this.taskRepository.save(task);
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: { subtasks: true },
    });

    if (!task) throw new NotFoundException('Task not found');

    if (task.userId !== userId)
      throw new UnauthorizedException(
        'You are not authorized to delete this task',
      );

    await this.deleteSubtasksRecursive(task);

    return { message: 'Task and its subtasks deleted successfully' };
  }
}
