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

  @OneToMany(
    () => ProductImages,
    (productImages) => productImages.create_fish,
    {
      cascade: true,
    },
  )
  product_images: ProductImages[];

  @Column({ default: false })
  delete_flag: boolean;

  @ManyToOne(() => Category, (category) => category.fishes, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: string;
}
