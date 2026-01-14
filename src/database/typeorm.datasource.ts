import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../modules/users/user.entity';
import { Product } from '../modules/products/product.entity';
import { Order } from '../modules/orders/order.entity';

// Détecte si on est en mode compilé (production) ou source (dev)
const isProduction = process.env.NODE_ENV === 'production';
const extension = isProduction ? 'js' : 'ts';
const directory = isProduction ? 'dist' : 'src';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'ecommerce',
  entities: [User, Product, Order],
  // Utilise le bon chemin selon l'environnement
  migrations: [`${directory}/database/migrations/*.${extension}`],
  // Optionnel mais utile pour les logs
  logging: true,
});
