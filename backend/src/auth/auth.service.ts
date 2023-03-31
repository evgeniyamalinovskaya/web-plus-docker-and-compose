import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

// для аутентификации пользователя (с помощью него мы будем генерировать JWT-токен)
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User) {
    // генерируем токен
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
  /* Добавим метод validateFromYandex, который будет отвечать за проверку */
  /* на наличие пользователя в БД и за создание пользователя, */
  /* если его ещё нет */
  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findUserPassword(username);
    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      throw new NotFoundException('Пользователь не найден');
    }
    /* В идеальном случае пароль обязательно должен быть захэширован */
    if (user && passwordCorrect) {
      /* Исключаем пароль из результата */
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
