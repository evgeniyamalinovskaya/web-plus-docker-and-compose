import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Offer } from './offers/entities/offer.entiti';
import { Wish } from './wishes/entities/wishes.entity';
import { Wishlist } from './wishlistlists/entities/wishlist.entiti';
import { WishesModule } from './wishes/wishes.module';
import { OffersModule } from './offers/offers.module';
import { WishListListsModule } from './wishlistlists/wishlistlists.module';

const {
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_PORT
} = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST || 'database',
      port: parseInt(POSTGRES_PORT, 10) || 5432,
      username: POSTGRES_USER || 'student',
      password: POSTGRES_PASSWORD || 'student',
      database: POSTGRES_DB || 'kupipodariday',
      entities: [User, Wish, Offer, Wishlist],
      synchronize: true,
    }),
    UsersModule,
    WishesModule,
    WishListListsModule,
    OffersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
