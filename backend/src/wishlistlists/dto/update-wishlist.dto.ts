import { Length, IsUrl, IsArray, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateWishlistDto } from './create-wishlist.dto';
import { Wish } from '../../wishes/entities/wishes.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

//Cхема списка подарков (wishlist):
export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  id: number;
  @Length(1, 250)
  //название списка, не может быть длиннее 250 символов и короче одного
  name: string;

  // @Length(0, 1500)
  // //описание подборки, строка до 1500 символов
  // description: string;

  @IsUrl()
  //обложка для подборки;
  image: string;

  //items содержит набор ссылок на подарки
  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];

  items: Wish[];
}
