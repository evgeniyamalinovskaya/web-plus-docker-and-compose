import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get() // этот обработчик будет вызван для запроса GET /users
  findAll(): string {
    return 'Этот метод возвращает список пользователей';
  }
}
