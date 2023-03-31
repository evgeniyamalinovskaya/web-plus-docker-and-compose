import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wishes.entity';

//Схема желающих скинуться (offer):
@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  //уникальный числовой идентификатор
  id: number;

  @CreateDateColumn()
  //дата создания (тип значения Date)
  createdAt: Date;

  @UpdateDateColumn()
  //дата изменения (тип значения Date)
  updatedAt: Date;

  //содержит id желающего скинуться
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  // содержит ссылку на товар
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column()
  //сумма заявки, округляется до двух знаков после запятой
  amount: number;

  @Column({
    //по умолчанию равен
    default: false,
  })
  // флаг, который определяет показывать ли
  // информацию о скидывающемся в списке
  hidden: boolean;
}
