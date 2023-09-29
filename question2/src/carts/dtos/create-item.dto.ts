import { IsOptional, IsString, IsNumber, IsInt } from 'class-validator';

export class CreateItemDto {
  @IsOptional()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsInt()
  quantity: number;

  @IsOptional()
  totalPrice: number;
}
