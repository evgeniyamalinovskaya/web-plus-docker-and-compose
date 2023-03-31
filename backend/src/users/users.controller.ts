import {
  Body,
  Controller,
  Delete,
  Get, NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user-dto';
import { User } from './entities/user.entity';

// добавим контроллеры
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // просмотр всех user (+)
  @Get('find')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // для просмотра своего профиля (+)
  @Get('me')
  async getMe(@Req() req) {
    //const user = await this.usersService.findOne(req.user.id);
    return req.user;
  }

  //Все подарки пользователя (+)
  @Get('me/wishes')
  async getOwnUserWishes(@Req() req) {
    return await this.usersService.findUserWishes(req.user.id);
  }

  //для обновления своего профиля (+)
  @Patch('me')
  async updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateOne(req.user.id, updateUserDto);
  }

  //поиск в базе по имени пользователя (+)
  @Get(':username')
  async findUserByName(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    const { password, ...result } = user;
    return result;
  }

  //для создания своего профиля (+)
  @Post('find')
  async create(@Body() user: QueryUserDto) {
    return this.usersService.findMany(user);
  }

  //подарки, других пользователей (+)
  @Get(':username/wishes')
  async getUsernameWishes(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    return await this.usersService.findUserWishes(user.id);
  }
}
