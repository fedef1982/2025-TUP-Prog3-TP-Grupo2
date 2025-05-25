import {
  Controller,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  Body,
  Post,
  Patch,
} from '@nestjs/common';
import { UsersService } from './usuario.service';
import { User } from './usuario.model';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

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

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateUsuarioDto: UpdateUsuarioDto,
  ): Promise<User> {
    return this.usersService.update(id, UpdateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
