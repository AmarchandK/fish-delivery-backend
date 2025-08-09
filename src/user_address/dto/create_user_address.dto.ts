import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserAddressDto {
  @ApiProperty({ example: '123 Street', description: 'Address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'City', description: 'City' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'State', description: 'State' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 'Country', description: 'Country' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: '123456', description: 'Pincode' })
  @IsString()
  @IsNotEmpty()
  pincode: string;

  @ApiProperty({ example: '1', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: '1234567890', description: 'Mobile' })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  mobile: string;
}
