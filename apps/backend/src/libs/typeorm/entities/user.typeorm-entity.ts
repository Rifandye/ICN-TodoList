import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTypeOrmEntity } from './base.typeorm-entity';
import { ProjectTypeOrmEntity } from './project.typeorm-entity';
import { TaskTypeOrmEntity } from './task.typeorm-entity';

@Entity({ name: 'users' })
export class UserTypeOrmEntity extends BaseTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_name', type: 'varchar', nullable: false })
  userName: string;

  @Column({ name: 'full_name', type: 'varchar', nullable: false })
  fullName: string;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  password: string;

  @OneToMany(() => ProjectTypeOrmEntity, (project) => project.user)
  projects: ProjectTypeOrmEntity[];

  @OneToMany(() => TaskTypeOrmEntity, (task) => task.user)
  tasks: TaskTypeOrmEntity[];
}
