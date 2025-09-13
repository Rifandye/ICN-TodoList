import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimestampzTypeOrmEntity } from './base-timestampz.typeorm-entity';
import { ProjectTypeOrmEntity } from './project.typeorm-entity';
import { UserTypeOrmEntity } from './user.typeorm-entity';

@Entity({ name: 'tasks' })
export class TaskTypeOrmEntity extends BaseTimestampzTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', type: 'varchar', nullable: false })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'status', type: 'varchar', nullable: true })
  status: string;

  @Column({ name: 'priority', type: 'smallint', nullable: false })
  priority: number;

  @Column({ name: 'parent_task_id', type: 'uuid', nullable: true })
  parentTaskId: string | null;

  @Column({ name: 'project_id', type: 'uuid', nullable: true })
  projectId: string | null;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @Column({ name: 'due_date', type: 'timestamptz', nullable: true })
  dueDate: Date;

  @OneToMany(() => TaskTypeOrmEntity, (task) => task.parentTask)
  subtasks: TaskTypeOrmEntity[];

  @ManyToOne(() => TaskTypeOrmEntity, (task) => task.subtasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_task_id' })
  parentTask?: TaskTypeOrmEntity;

  @ManyToOne(() => ProjectTypeOrmEntity, (project) => project.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project?: ProjectTypeOrmEntity;

  @ManyToOne(() => UserTypeOrmEntity, (user) => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: UserTypeOrmEntity;
}
