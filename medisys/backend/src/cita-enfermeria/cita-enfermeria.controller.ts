import { Controller, Post, Body, Get, Param, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common'
import { CitaEnfermeriaService } from './cita-enfermeria.service'
import { AuthGuard } from '../auth/auth.guard'
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

@UseGuards(AuthGuard)
@Controller('cita-enfermeria')
export class CitaEnfermeriaController {
    constructor(private readonly citaEnfermeriaService: CitaEnfermeriaService) {}

    @Post()
    @UseInterceptors(FileInterceptor('imagen', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const name = Date.now() + extname(file.originalname)
                cb(null, name)
            }
        })
    }))
    crear(@Req() req: Request, @Body() body: { motivo: string }, @UploadedFile() file?: Express.Multer.File) {
        const userId = (req as any).user.sub
        const imagen = file ? file.filename : undefined
        return this.citaEnfermeriaService.crear(userId, body.motivo, imagen)
    }

    @Get('fila')
    fila(@Req() req: Request) {
        const userId = (req as any).user.sub
        return this.citaEnfermeriaService.filaVirtual(userId)
    }

    @Get('estado/:token')
    getEstado(@Param('token') token: string) {
        return this.citaEnfermeriaService.getEstadoPorToken(token)
    }
}