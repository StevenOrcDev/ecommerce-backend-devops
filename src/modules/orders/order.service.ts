import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Order } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/user.service';
import { ProductsService } from '../products/poduct.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async create(dto: CreateOrderDto) {
    const user = await this.usersService.findoneById(dto.userId);
    const product = await this.productsService.findOneById(dto.productId);

    if (!user || !product) {
      throw new NotFoundException('User or Product not found');
    }

    const order = this.ordersRepository.create({ user, product });
    return this.ordersRepository.save(order);
  }

  async findAll() {
    return this.ordersRepository.find({ relations: ['user', 'product'] });
  }

  async findOne(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    return this.ordersRepository.remove(order);
  }
}
