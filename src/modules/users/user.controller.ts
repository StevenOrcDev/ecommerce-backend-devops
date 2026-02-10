import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserIdParamsDto } from './dto/userIdParams.dto';
import { PostNewPasswordDto } from './dto/postNewPassword.dto';
import type { GetUserPasswordResponse } from './models/GetUserPasswordResponse';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: UserIdParamsDto) {
    const { id } = params;
    return this.usersService.findoneById(id);
  }

  @Delete(':id')
  remove(@Param() params: UserIdParamsDto) {
    const { id } = params;
    return this.usersService.remove(id);
  }

  @Get(':id/password')
  async getUserPassword(@Param() params: UserIdParamsDto): Promise<GetUserPasswordResponse> {
    const { id } = params;
    return this.usersService.getUserPassword(id);
  }

  @Post(':id/reset-password')
  resetPassword(@Param() params: UserIdParamsDto, @Body() body: PostNewPasswordDto) {
    const { id } = params;
    const { newPassword } = body;

    return this.usersService.resetPassword(id, newPassword);
  }
}
