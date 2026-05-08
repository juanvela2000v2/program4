import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { AuthGuard } from '../auth/auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Post()
  async create(@Body() body: any) {
    if (body.pass) {
      const bcrypt = require('bcrypt')
      body.pass = bcrypt.hashSync(body.pass, 10)
    }
    return this.usersService.create(body)
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    if (body.pass) {
      const bcrypt = require('bcrypt')
      body.pass = bcrypt.hashSync(body.pass, 10)
    }
    return this.usersService.update(id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id)
  }

  @Get('medicos')
  findMedicos() { return this.usersService.findByRole('medico') }

  @Get('enfermeras')
  findEnfermeras() { return this.usersService.findByRole('enfermera') }
  @Get('usuarios')
findUsuarios() { return this.usersService.findByRole('usuario') }
}