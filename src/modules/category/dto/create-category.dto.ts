import { IsString, IsOptional, IsBoolean } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Category Name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Category Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
