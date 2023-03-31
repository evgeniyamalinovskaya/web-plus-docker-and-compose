import { Length, IsUrl, IsArray, IsNumber } from 'class-validator';
import { Exclude } from 'class-transformer';

//Cхема списка подарков (wishlist):
export class CreateWishlistDto {
  @Length(1, 250)
  //название списка, не может быть длиннее 250 символов и короче одного
  name: string;

  @IsUrl()
  //обложка для подборки;
  image: string;

  //items содержит набор ссылок на подарки
  @IsArray()
  @Exclude({ toPlainOnly: true })
  @IsNumber({}, { each: true })
  itemsId: number[];
}
