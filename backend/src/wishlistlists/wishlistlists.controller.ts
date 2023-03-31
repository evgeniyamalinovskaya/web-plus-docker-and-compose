import {
  Body,
  Controller,
  Delete,
  Get, NotFoundException,
  Param, ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entiti';
import { WishlistlistsService } from './wishlistlists.service';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistlistsController {
  constructor(private readonly wishlistsService: WishlistlistsService) {}

  // все списки подарков
  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }
  //создать список подарков
  @Post()
  async create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(req.user, createWishlistDto);
  }

  // редактировать определенный список подарков
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.findOne(id);
    if (req.user.id === wishlist.owner.id) {
      updateWishlistDto.id = id;
      return await this.wishlistsService.update(+id, updateWishlistDto);
    } else {
      throw new NotFoundException('Этот лист вам не принадлежит');
    }
  }
  // найти определенный список подарков
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  // удалить по id
  @Delete(':id')
  async removeById(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const wishlist = await this.wishlistsService.findOne(id);

    if (wishlist.owner === null || wishlist.owner.id !== req.user.id) {
      throw new NotFoundException('Этот лист вам не принадлежит');
    }
    await this.wishlistsService.removeOne(id);
    return wishlist;
  }
}
