import {
  Controller,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  Body,
  Post,
} from '@nestjs/common';
import { UsersService } from './usuario.service';
import { User } from './usuario.model';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<User> {
    return this.usersService.create(createUsuarioDto);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
