// product_images.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CreateFish } from './create_fish.entity';

@Entity()
export class ProductImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column()
  deleteFlag: boolean;

  @ManyToOne(() => CreateFish, (createFish) => createFish.productImages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'create_fish_id' })
  createFish: CreateFish;

  @Column()
  create_fish_id: number;
}
