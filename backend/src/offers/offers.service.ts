import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entiti';
import { Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import { CreateOffersDto } from './dto/create-offers.dto';

// Реализуйте CRUD-методы сервисов
// Добавим необходимые методы в сервисы
@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  //
  async findAll() {
    return await this.offersRepository.find({
      relations: { item: true, user: true },
    });
  }

  //(+)
  async findId(id: number) {
    const offers = await this.offersRepository.findOne({
      where: { id },
      relations: { item: true, user: true },
    });
    if (!offers) {
      throw new NotFoundException('Такого предложения нет');
    }
    return offers;
  }

  //
  async create(user: User, dto: CreateOffersDto) {
    const wish = await this.wishesService.findOneWishes({
      where: { id: dto.itemId },
      relations: { owner: true, offers: true },
    });
    if (wish.owner.id === user.id) {
      throw new NotFoundException('Это ваш подарок');
    }
    if (dto.amount > wish.price - wish.raised) {
      throw new NotFoundException(
        'Вы превысили нужный лимит перевода денежных средств',
      );
    }
    const offer = await this.offersRepository.save({
      ...dto,
      user: user,
      item: wish,
    });
    const UpdatedWish = {
      raised: wish.raised + dto.amount,
    };
    await this.wishesService.updateOne(wish.id, UpdatedWish);

    return offer;
  }
}
