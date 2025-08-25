import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: '12345678901234567890', description: 'Firebase Uid' })
  @IsString()
  @IsNotEmpty()
  readonly firebaseUid: string;

  @ApiProperty({ example: '+380501234567', description: 'User phone' })
  @IsPhoneNumber('UA')
  readonly phone: string;
}
