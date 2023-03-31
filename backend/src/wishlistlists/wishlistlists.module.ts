import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entiti';
import { WishesModule } from '../wishes/wishes.module';
import { WishlistlistsController } from './wishlistlists.controller';
import { WishlistlistsService } from './wishlistlists.service';

//декоратор
@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), WishesModule],
  controllers: [WishlistlistsController],
  providers: [WishlistlistsService],
  exports: [WishlistlistsService],
})
export class WishListListsModule {}
