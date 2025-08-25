//
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFishDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'Fish Name',
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 100,
  })
  price: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Fish Description',
  })
  description: string;

  @IsNotEmpty()
  @ApiProperty({
    example: ['url1', 'url2'],
  })
  productImages: string[];

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
