import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import {Length, IsUrl, IsEmail, IsNotEmpty, IsOptional} from 'class-validator';
import { Wish } from '../../wishes/entities/wishes.entity';
import { Offer } from '../../offers/entities/offer.entiti';
import { Wishlist } from '../../wishlistlists/entities/wishlist.entiti';

//Схема пользователя (user):
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  //уникальный числовой идентификатор
  id: number;

  @CreateDateColumn()
  //дата создания (тип значения Date)
  createdAt: Date;

  @UpdateDateColumn()
  //дата изменения (тип значения Date)
  updatedAt: Date;

  @Column({ unique: true })
  @IsNotEmpty()
  @Length(2, 30)
  //имя пользователя, уникальная строка от 2 до 30 символов, обязательное поле
  username: string;

  @Column({
    //информация о пользователе, строка от 2 до 200 символов
    default: 'Пока ничего не рассказал о себе',
  })
  @Length(2, 200)
  about: string;

  @IsOptional() @Column({
    //ссылка на аватар
    default: 'https://i.pravatar.cc/300',
  })
  @IsUrl()
  avatar: string;

  @Column({ unique: true, select: false })
  @IsEmail()
  //адрес электронной почты пользователя
  email: string;

  @Column({ select: false }) //защитили от просмотра пароля
  //пароль пользователя, строка
  password: string;

  //wishes — список желаемых подарков
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  //offers — содержит список подарков, на которые скидывается пользователь
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  //wishlists - содержит список вишлистов, которые создал пользователь
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
