import { IsString, IsNumber, IsInt } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsInt()
  quantity: number;
}
