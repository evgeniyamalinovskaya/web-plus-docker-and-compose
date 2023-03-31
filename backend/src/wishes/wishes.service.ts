import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, Repository } from 'typeorm';
import { CreateWishesDto } from './dto/create-wishes.dto';
import { User } from '../users/entities/user.entity';
import { Wish } from './entities/wishes.entity';
import { UpdateWishesDto } from './dto/update-wishes.dto';

// Реализуйте CRUD-методы сервисов
// Добавим необходимые методы в сервисы
@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  // (+)
  findAll(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  //(+)
  async create(user: User, createWishesDto: CreateWishesDto): Promise<Wish> {
    return await this.wishRepository.save({
      ...createWishesDto,
      owner: user,
    });
  }

  //(+)
  async findLast(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
      relations: { owner: true, offers: true },
    });
  }

  //(+)
  async findTop(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 10,
      order: { copied: 'DESC' },
    });
  }

  //(+)
  async findOne(id: number): Promise<Wish> {
    const wishId = await this.wishRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });
    if (!wishId) {
      throw new NotFoundException('Такого подарка не существует');
    }
    return wishId;
  }

  //(+)
  async findByIds(ids: number[]): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      where: { id: In(ids) },
    });
    if (!wishes) {
      throw new NotFoundException('Таких подарков не существует');
    }
    return wishes;
  }

  //(+)
  async updateOne(wishId: number, updatedWish: UpdateWishesDto) {
    const wish = await this.findOne(wishId);
    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }
    return await this.wishRepository.update(wishId, updatedWish);
  }

  //(+)
  async removeOne(wishId: number, userId: number) {
    const wish = await this.findOne(wishId);
    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Чужие подарки нельзя удалить');
    }
    await this.wishRepository.delete(wishId);
    return wish;
  }

  //(+)
  async copyWish(id: number, user: User) {
    const wish = await this.wishRepository.findOneBy({ id: id });
    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }
    delete wish.id;
    delete wish.createdAt;
    delete wish.updatedAt;
    await this.wishRepository.update(id, {
      copied: (wish.copied += 1),
    });
    const wishCopy = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
    };
    const copy = await this.create(user, wishCopy);
    return copy;
  }

  async findOneWishes(query: FindOneOptions<Wish>): Promise<Wish> {
    return await this.wishRepository.findOne(query);
  }
}
