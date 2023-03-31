import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entiti';
import { Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {
  }

  //(+)
  async findAll() {
    return await this.wishlistsRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  //(+)
  async create(owner: User, createWishlistDto: CreateWishlistDto) {
    const wishes = await this.wishesService.findByIds(
      createWishlistDto.itemsId,
    );
    const wishlistItems = await this.wishlistsRepository.save({
      ...createWishlistDto,
      owner: owner,
      items: wishes,
    });
    delete wishlistItems.itemsId;
    return wishlistItems;
  }

  //
  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishes = await this.wishesService.findByIds(
      updateWishlistDto.itemsId,
    );
    delete updateWishlistDto.itemsId;
    await this.wishlistsRepository.update(id, updateWishlistDto);

    updateWishlistDto.items = wishes;
    await this.wishlistsRepository.save(updateWishlistDto);
    return this.findOne(id);
  }

  //(+)
  async findOne(id: number) {
    return await this.wishlistsRepository.findOne({
      where: { id },
      relations: { items: true, owner: true },
    });
  }
  async removeOne(wishId: number) {
    const wishlist = await this.findOne(wishId);
    if (!wishlist) {
      throw new NotFoundException('Такого списка подарков не существует');
    }
    await this.wishlistsRepository.delete(wishId);
    return wishlist;
  }
}
