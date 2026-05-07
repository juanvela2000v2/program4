import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';
import { Roles } from '../../infrastructure/decorators/roles.decorator';
import { RolesGuard } from '../../infrastructure/guards/roles.guard';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  listar() {
    return this.productosService.listar();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productosService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  crear(@Req() request: any, @Body() payload: any) {
    const vendedorNombre = request.user?.nombre || 'Vendedor';
    const vendedorAvatar = request.user?.avatar || 'https://i.pravatar.cc/150?img=21';
    return this.productosService.crear({
      ...payload,
      usuarioId: request.user.sub,
      vendedorNombre,
      vendedorAvatar,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  actualizar(@Param('id') id: string, @Body() payload: any) {
    return this.productosService.actualizar(id, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  eliminar(@Param('id') id: string) {
    return this.productosService.eliminar(id);
  }
}
