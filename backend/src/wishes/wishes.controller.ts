import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { WishesService } from './wishes.service';
import { CreateWishesDto } from './dto/create-wishes.dto';
import { UpdateWishesDto } from './dto/update-wishes.dto';
import { User } from '../users/entities/user.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  // все подарки (+)
  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  //создаем новый подарок (+)
  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() req, @Body() createWishesDto: CreateWishesDto) {
    return await this.wishesService.create(req.user, createWishesDto);
  }

  // последние созданные подарки (+)
  @Get('last')
  async getLast() {
    return await this.wishesService.findLast();
  }

  //самые желанные подарки (+)
  @Get('top')
  async findTop() {
    return await this.wishesService.findTop();
  }

  //найди подарок по id (+)
  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.wishesService.findOne(+id);
  }

  //редактировать конкретный подарок по id (+)
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateOne(
    @Req() req,
    @Param('id') id: string,
    @Body() UpdatedWish: UpdateWishesDto,
  ) {
    await this.wishesService.updateOne(+id, UpdatedWish);
    return await this.wishesService.findOne(+id);
  }

  //удалить подарок по id (+)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async removeOne(@Req() req, @Param('id') id: string) {
    return await this.wishesService.removeOne(+id, req.user.id);
  }

  //создание копии подарка
  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copy(@Req() { user }: { user: User }, @Param('id') id: string) {
    return await this.wishesService.copyWish(Number(id), user);
  }
}
