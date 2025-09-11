import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTypeOrmEntity } from './base.typeorm-entity';

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
}
