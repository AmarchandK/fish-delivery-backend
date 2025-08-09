import { UserAddress } from 'src/user_address/entity/user_address_entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ default: false })
  isLoggedIn: boolean;

  @Column({ default: false })
  deleteFlag: boolean;

  @OneToMany(() => UserAddress, (userAddress) => userAddress.user)
  addresses: UserAddress[];
}
