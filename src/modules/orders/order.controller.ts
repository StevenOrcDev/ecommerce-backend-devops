import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
