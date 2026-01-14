import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/typeorm.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/prodcut.module';
import { OrdersModule } from './modules/orders/order.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [DatabaseModule, UsersModule, ProductsModule, OrdersModule, HealthModule],
  controllers: [],
})
export class AppModule {}
