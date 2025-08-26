import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { CreateFish } from './create_fish.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: string;

  @ManyToOne(() => CreateFish)
  @JoinColumn({ name: 'fishId' })
  fish: CreateFish;

  @Column()
  fishId: number;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  name: string;

  @Column('text', { nullable: true })
  image: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;
}
