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
  delete_flag: boolean;

  @ManyToOne(() => CreateFish, (createFish) => createFish.product_images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'create_fish_id' })
  create_fish: CreateFish;

  @Column()
  create_fish_id: number;
}
