import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, ManyToMany, JoinTable,
} from 'typeorm';
import { Length, IsUrl, IsOptional, IsArray, IsNumber } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wishes.entity';

//Cхема списка подарков (wishlist):
@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  //уникальный числовой идентификатор
  id: number;

  @CreateDateColumn()
  //дата создания (тип значения Date)
  createdAt: Date;

  @UpdateDateColumn()
  //дата изменения (тип значения Date)
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  //название списка, не может быть длиннее 250 символов и короче одного
  name: string;

  @Column({ default: '' })
  @Length(0, 1500)
  @IsOptional()
  //описание подборки, строка до 1500 символов
  description: string;

  @Column({ default: '' })
  @IsUrl()
  //обложка для подборки;
  image: string;

  //содержит один подарок
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  //содержит набор ссылок на подарки
  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
