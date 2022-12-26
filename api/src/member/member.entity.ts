import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('members')
export class Member {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'oa_uid', type: 'varchar', nullable: false })
  oaUid?: string;

  @Column({ name: 'display_name', type: 'varchar', nullable: true })
  displayName?: string;

  @Column({ name: 'picture_url', type: 'text', nullable: true })
  pictureUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  language?: string;

  @Column({ name: 'is_active', type: 'boolean', nullable: true, default: true })
  isActive?: boolean;

  @Index()
  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

}
