import { IsNumber, IsBoolean } from 'class-validator';

export class CreateOffersDto {
  @IsNumber()
  amount: number;

  @IsBoolean()
  hidden?: boolean;

  @IsNumber()
  itemId: number;
}
