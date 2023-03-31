import { IsEmail, IsNotEmpty, IsUrl, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// схема пользователя (user)
export class UpdateUserDto extends PartialType(CreateUserDto) {
  // имя пользователя, уникальная строка от 2 до 30 символов, обязательное поле
  @Length(2, 30)
  username: string;

  @Length(2, 200)
  // информация о пользователе, строка от 2 до 200 символов
  about?: string;

  @IsUrl()
  // ссылка на аватар, В качестве значения по умолчанию задайте https://i.pravatar.cc/300
  avatar?: 'https://i.pravatar.cc/150?img=3';

  @IsEmail()
  // адрес электронной почты пользователя, должен быть уникален
  email: string;

  @IsNotEmpty()
  //пароль пользователя
  password: string;
}
