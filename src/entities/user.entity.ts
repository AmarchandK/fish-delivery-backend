import { UserAddress } from 'src/entities/user_address_entity';
import { Order } from './order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  DELIVERY_PARTNER = 'DELIVERY_PARTNER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  firebaseUid: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  phone: string;

  @Column({ 
    type: 'enum', 
    enum: UserRole, 
    default: UserRole.USER 
  })
  role: UserRole;

  @Column({ default: false })
  isLoggedIn: boolean;

  @Column({ default: false })
  deleteFlag: boolean;

  @OneToMany(() => UserAddress, (userAddress) => userAddress.user)
  addresses: UserAddress[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
