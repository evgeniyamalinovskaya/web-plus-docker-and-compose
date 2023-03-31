import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IsInt, Length, IsUrl } from 'class-validator';
import { Offer } from '../../offers/entities/offer.entiti';
import { User } from '../../users/entities/user.entity';

//Схема для подарков (wish):
@Entity()
export class Wish {
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
  //название подарка
  name: string;

  @Column()
  @IsUrl()
  //ссылка на интернет-магазин, в котором можно приобрести подарок
  link: string;

  @Column()
  @IsUrl()
  //ссылка на изображение подарка, строка
  image: string;

  @Column()
  @IsInt()
  //стоимость подарка, с округлением до сотых
  price: number;

  @Column({ default: 0 })
  @IsInt()
  //сумма предварительного сбора или сумма,
  // которую пользователи сейчас готовы скинуть на подарок
  raised: number;

  //ссылка на пользователя, который добавил пожелание подарка Сделать
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  //строка с описанием подарка длиной от 1 и до 1024 символов
  description: string;

  //массив ссылок на заявки скинуться от других пользователей Сделать
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  @IsInt()
  //содержит cчётчик сколько раз был скопирован подарок
  copied: number;
}
