import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../modules/users/user.entity';
import { Product } from '../modules/products/product.entity';
import { Order } from '../modules/orders/order.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'ecommerce',
  entities: [User, Product, Order],
  migrations: ['src/database/migrations/*.ts'],
});
