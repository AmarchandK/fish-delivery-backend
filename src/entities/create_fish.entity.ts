// create fish
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ProductImages } from './product_images.entity';

@Entity()
export class CreateFish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @OneToMany(() => ProductImages, (productImages) => productImages.createFish)
  @JoinColumn({ name: 'create_fish_id' })
  productImages: ProductImages[];

  @Column()
  deleteFlag: boolean;
}
