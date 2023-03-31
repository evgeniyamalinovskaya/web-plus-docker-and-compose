import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { OffersService } from './offers.service';
import { CreateOffersDto } from './dto/create-offers.dto';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  // найдем все предложения (+)
  @Get()
  async findAll() {
    return await this.offersService.findAll();
  }

  //создадим предложение скинуться (+)
  @Post()
  async create(@Req() req, @Body() createOffersDto: CreateOffersDto) {
    return await this.offersService.create(req.user, createOffersDto);
  }

  // найдем предложение по id (+)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.offersService.findId(+id);
  }
}
