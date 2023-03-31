import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user-dto';

// Реализуйте CRUD-методы сервисов
// Добавим необходимые методы в сервисы
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // метод для просмотра всех пользователей
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  //метод для регистрации пользователей (создание)
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    const { password, ...result } = user;
    const hash = await bcrypt.hash(password, 10);
    return await this.usersRepository.save({ password: hash, ...result });
  }

  //обновления (updateOne) для одной записи
  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  //поиска по условию одной (findOne) или нескольких записей(элементов)
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id }); //использовать фильтр query
    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }
    return user;
  }

  // Метод для поиска пользователя по логину
  async findByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOneBy({ username });
  }

  // Метод поиска пользователя по логину в котором видно password
  async findUserPassword(username: string): Promise<User> {
    return await this.usersRepository
      .createQueryBuilder()
      .select('user')
      .addSelect('user.password')
      .from(User, 'user')
      .where('user.username = :username', { username: username })
      .getOne();
  }
  //+
  //Реализуйте поиск пользователей
  //Сделайте метод для поиска многих пользователей по заданным
  // критериям и назовите его findMany. На основе его реализуйте
  // поиск по почте и имени пользователя
  async findMany({ query }: QueryUserDto): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ email: query }, { username: query }], //использовать фильтр query
    });
  }

  //Метод позволяет найти подарки созданные другими пользователями(+)
  async findUserWishes(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: {
        wishes: { owner: true },
      },
    });
    if (user.wishes.length === 0) {
      throw new NotFoundException('У вас нет подарков');
    }
    return user.wishes;
  }

  //Метод позволяет найти все подарки созданные текущим пользователем
  // async getOwnUserWishes(id: number) {
  //   console.log(id)
  //   const user = await this.usersRepository.findOne({
  //     where: { id: id },
  //     relations: {
  //       wishes: { owner: true },
  //     },
  //   });
  //   if (user.wishes.length === 0) {
  //     throw new NotFoundException('У вас нет подарков');
  //   }
  //   return user.wishes;
  // }
}
