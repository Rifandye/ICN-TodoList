import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimestampzTypeOrmEntity } from './base-timestampz.typeorm-entity';
import { UserTypeOrmEntity } from './user.typeorm-entity';
import { TaskTypeOrmEntity } from './task.typeorm-entity';

@Entity({ name: 'projects' })
export class ProjectTypeOrmEntity extends BaseTimestampzTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: false })
  description: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @ManyToOne(() => UserTypeOrmEntity, (user) => user.projects)
  @JoinColumn({ name: 'user_id' })
  user: UserTypeOrmEntity;

  @OneToMany(() => TaskTypeOrmEntity, (task) => task.project)
  tasks: TaskTypeOrmEntity[];
}
