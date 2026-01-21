import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // --- KAYIT KAPISI (POST /users) ---
  @Post()
  create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }
  // ----------------------------------

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // Giriş yaparken email ile kullanıcı bulmak için
  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }
}