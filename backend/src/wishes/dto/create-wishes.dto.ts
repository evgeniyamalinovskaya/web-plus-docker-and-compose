import { IsInt, IsUrl, Length } from 'class-validator';

// Схема для подарков (wish):
export class CreateWishesDto {
  // имя пользователя, уникальная строка от 2 до 30 символов, обязательное поле
  @Length(2, 30)
  name: string;

  @IsUrl()
  // ссылка на аватар
  link?: string;

  @IsUrl()
  //ссылка на изображение подарка, строка
  image?: string;

  @IsInt()
  //стоимость подарка
  price?: number;

  @Length(1, 1024)
  //строка с описанием подарка длиной от 1 и до 1024 символов
  description: string;
}
