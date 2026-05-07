import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, Req,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { AlertaService } from './alerta.service';
import { WsService }     from '../shared/ws.service';

const storage = diskStorage({
  destination: './uploads',
  filename: (_, f, cb) =>
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${extname(f.originalname)}`),
});

@Controller('alertas')
export class AlertaController {
  constructor(
    private alertaService: AlertaService,
    private ws: WsService,
  ) {}

  @Get()
  obtenerTodas(@Query('estado') estado?: string, @Query('tipoProblema') tp?: string) {
    return this.alertaService.obtenerTodas({ estado, tipoProblema: tp });
  }

  @Get('mapa')         obtenerMapa()   { return this.alertaService.obtenerParaMapa(); }
  @Get('estadisticas') estadisticas()  { return this.alertaService.obtenerEstadisticas(); }

  @Get('ubicacion/:id')
  porUbicacion(@Param('id') id: string) { return this.alertaService.obtenerPorUbicacion(+id); }

  @Get(':id')
  porId(@Param('id') id: string) { return this.alertaService.obtenerPorId(+id); }

  @Post('ciudadano')
  @UseInterceptors(FileInterceptor('foto', {
    storage,
    fileFilter: (_, f, cb) => cb(null, /\.(jpg|jpeg|png|webp)$/i.test(f.originalname)),
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async crearCiudadano(
    @Body() body: any,
    @UploadedFile() foto: Express.Multer.File,
    @Req() req: Request,
  ) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]
             || req.socket.remoteAddress || 'unknown';

    const resultado = await this.alertaService.crearReporteCiudadano({
      tipoProblema: body.tipoProblema,
      descripcion:  body.descripcion,
      latitud:      parseFloat(body.latitud),
      longitud:     parseFloat(body.longitud),
      foto:         foto ? `/uploads/${foto.filename}` : undefined,
      ip,
      usuarioId: body.usuarioId ? +body.usuarioId : undefined,
    });

    // Notificacion en tiempo real al admin
    this.ws.emit('nuevo-reporte-ciudadano', {
      id:           resultado.id,
      tipoProblema: resultado.tipoProblema,
      descripcion:  resultado.descripcion,
      latitud:      resultado.latitud,
      longitud:     resultado.longitud,
      foto:         resultado.foto,
      reporteCount: resultado.reporteCount,
      fechaReporte: resultado.fechaReporte,
      estado:       resultado.estado,
    });

    return resultado;
  }

  @Post()   crear(@Body() dto: any) { return this.alertaService.crear(dto); }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() dto: any) {
    return this.alertaService.actualizar(+id, dto);
  }

  @Put(':id/resolver')
  resolver(@Param('id') id: string, @Body() b: { notaResolucion: string }) {
    return this.alertaService.resolver(+id, b.notaResolucion);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) { return this.alertaService.eliminar(+id); }
}