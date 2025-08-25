import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ProductImages } from './product_images.entity';
import { Category } from './category.entity';

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

  @OneToMany(() => ProductImages, (productImages) => productImages.createFish, {
    cascade: true,
  })
  productImages: ProductImages[];

  @Column()
  deleteFlag: boolean;

  @ManyToOne(() => Category, (category) => category.fishes, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: string;
}
