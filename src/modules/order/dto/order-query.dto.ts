import {
  IsOptional,
  IsNumber,
  Min,
  IsString,
  IsEnum,
  Max,
} from 'class-validator';
import { OrderStatus } from '../../../entities/order.entity';
import { Type } from 'class-transformer';

export class OrderQueryDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
