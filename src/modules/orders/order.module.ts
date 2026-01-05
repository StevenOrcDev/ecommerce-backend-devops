import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrdersController } from './order.controller';
import { ProductsModule } from '../products/prodcut.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ProductsModule, UsersModule],
  providers: [OrderService],
  controllers: [OrdersController],
})
export class OrdersModule {}
