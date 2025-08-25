import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { CreateFish } from './create_fish.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => CreateFish, (fish) => fish.category)
  fishes: CreateFish[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({})
  updatedAt: Date;
}
