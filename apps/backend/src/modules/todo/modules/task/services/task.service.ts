import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskTypeOrmEntity } from 'src/libs/typeorm/entities/task.typeorm-entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dtos/task.dto';
import { TaskStatus } from '../enums/task.enum';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TaskService {
  private readonly openAI: OpenAI;

  constructor(
    @InjectRepository(TaskTypeOrmEntity)
    private readonly taskRepository: Repository<TaskTypeOrmEntity>,

    private readonly configService: ConfigService,
  ) {
    this.openAI = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: this.configService.get<string>('OPENROUTER_API_KEY'),
    });
  }

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

  private getFallbackSuggestions(userInput: string): string[] {
    const lowercaseInput = userInput.toLowerCase();

    if (lowercaseInput.includes('learn') || lowercaseInput.includes('study')) {
      return [
        `Research basics about ${userInput.replace(/learn|study/gi, '').trim()}`,
        `Find online courses or tutorials`,
        `Practice with hands-on exercises`,
      ];
    }

    if (lowercaseInput.includes('build') || lowercaseInput.includes('create')) {
      return [
        `Plan the structure and requirements`,
        `Set up the development environment`,
        `Implement the core functionality`,
      ];
    }

    if (
      lowercaseInput.includes('improve') ||
      lowercaseInput.includes('better')
    ) {
      return [
        `Identify areas that need improvement`,
        `Research best practices and solutions`,
        `Implement changes step by step`,
      ];
    }

    return [
      `Break down "${userInput}" into smaller steps`,
      `Research tools and resources needed`,
      `Create a timeline and start working`,
    ];
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
      status: TaskStatus.PENDING,
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

  async generateTaskSuggestions(userInput: string) {
    try {
      const completion = await this.openAI.chat.completions.create({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'system',
            content: `You are a helpful task management assistant. When given a general goal or topic, generate exactly 3 specific, actionable tasks that would help achieve that goal. 
            
            Rules:
            - Each task should be clear, specific, and actionable
            - Tasks should be realistic and achievable
            - Return only the task titles, separated by newlines
            - Do not include numbers, bullets, or any formatting
            - Each task should be a single sentence
            - Focus on practical, concrete actions`,
          },
          {
            role: 'user',
            content: `Generate 3 specific task suggestions for: "${userInput}"`,
          },
        ],
      });

      const aiResponse = completion.choices[0]?.message?.content?.trim();

      if (!aiResponse) {
        throw new Error('No response from AI service');
      }

      const suggestions = aiResponse
        .split('\n')
        .map((task) => task.trim())
        .filter((task) => task.length > 0)
        .slice(0, 3);

      if (suggestions.length < 3) {
        return this.getFallbackSuggestions(userInput);
      }

      return suggestions;
    } catch (error) {
      console.error('Error generating AI task suggestions:', error);

      return this.getFallbackSuggestions(userInput);
    }
  }
}
