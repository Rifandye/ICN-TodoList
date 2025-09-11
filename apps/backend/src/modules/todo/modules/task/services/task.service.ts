import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskTypeOrmEntity } from 'src/libs/typeorm/entities/task.typeorm-entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskTypeOrmEntity)
    private readonly taskRepository: Repository<TaskTypeOrmEntity>,
  ) {}

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

  async deleteTask(taskId: string, userId: string) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: { subtasks: true },
    });

    if (!task) throw new NotFoundException('Task not found');

    if (task && task.userId !== userId)
      throw new UnauthorizedException(
        'You are not authorized to delete this task',
      );

    await this.taskRepository.remove(task);

    return { message: 'Task deleted successfully' };
  }
}
