import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alerta } from '../entities/alerta.entity';
import { Ubicacion } from '../entities/ubicacion.entity';
import { ReporteCiudadano } from '../entities/reporte-ciudadano.entity';

const MAX_REPORTES_POR_HORA = 3;
const RADIO_DUPLICADO_KM    = 0.5; // 500 metros

@Injectable()
export class AlertaService {
  constructor(
    @InjectRepository(Alerta)            private alertaRepo:  Repository<Alerta>,
    @InjectRepository(Ubicacion)         private ubicRepo:    Repository<Ubicacion>,
    @InjectRepository(ReporteCiudadano)  private reporteRepo: Repository<ReporteCiudadano>,
  ) {}

  // ── Anti-spam ────────────────────────────────────────────────
  private async verificarAntiSpam(ip: string, usuarioId?: number) {
    const hace1h = new Date();
    hace1h.setHours(hace1h.getHours() - 1);

    const q = this.reporteRepo.createQueryBuilder('r')
      .where('r.fecha > :desde', { desde: hace1h });

    if (usuarioId) q.andWhere('r.usuarioId = :uid', { uid: usuarioId });
    else           q.andWhere('r.ip = :ip', { ip });

    const count = await q.getCount();
    if (count >= MAX_REPORTES_POR_HORA) {
      throw new BadRequestException(
        `Límite alcanzado: máximo ${MAX_REPORTES_POR_HORA} reportes por hora. Intentá más tarde.`
      );
    }
  }

  // ── Anti-duplicado (Haversine) ───────────────────────────────
  private async buscarDuplicado(tipoProblema: string, lat: number, lng: number): Promise<Alerta | null> {
    const activas = await this.alertaRepo.find({
      where: [{ tipoProblema, estado: 'URGENTE' }, { tipoProblema, estado: 'MODERADO' }],
    });
    for (const a of activas) {
      if (a.latitud && a.longitud) {
        const dist = this.haversineKm(lat, lng, +a.latitud, +a.longitud);
        if (dist < RADIO_DUPLICADO_KM) return a;
      }
    }
    return null;
  }

  private haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371, dLat = ((lat2-lat1)*Math.PI)/180, dLon = ((lon2-lon1)*Math.PI)/180;
    const a = Math.sin(dLat/2)**2 +
              Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  // ── Reporte ciudadano ────────────────────────────────────────
  async crearReporteCiudadano(dto: {
    tipoProblema: string; descripcion?: string;
    latitud: number; longitud: number; foto?: string;
    ip: string; usuarioId?: number;
  }): Promise<Alerta> {
    await this.verificarAntiSpam(dto.ip, dto.usuarioId);

    const duplicado = await this.buscarDuplicado(dto.tipoProblema, dto.latitud, dto.longitud);
    let resultado: Alerta;

    if (duplicado) {
      // Merge: solo incrementar contador
      duplicado.reporteCount += 1;
      if (dto.descripcion)
        duplicado.descripcion = `${duplicado.descripcion || ''} | +1: ${dto.descripcion}`;
      resultado = await this.alertaRepo.save(duplicado);
    } else {
      const nueva = this.alertaRepo.create({
        tipoProblema: dto.tipoProblema,
        descripcion: dto.descripcion,
        latitud: dto.latitud,
        longitud: dto.longitud,
        foto: dto.foto,
        estado: 'MODERADO',
        fuente: 'CIUDADANO',
        ipReportador: dto.ip,
        reporteCount: 1,
        ...(dto.usuarioId ? { usuario: { id: dto.usuarioId } } : {}),
      });
      resultado = await this.alertaRepo.save(nueva);
    }

    // Registrar para anti-spam
    await this.reporteRepo.save(
      this.reporteRepo.create({ ip: dto.ip, usuarioId: dto.usuarioId, alerta: resultado })
    );

    return resultado;
  }

  // ── Admin: crear desde panel ─────────────────────────────────
  async crear(dto: any) {
    const obj: any = {
      tipoProblema: dto.tipoProblema, descripcion: dto.descripcion,
      estado: dto.estado || 'MODERADO', fuente: 'ADMIN',
    };
    if (dto.ubicacionId) obj.ubicacion = { id: +dto.ubicacionId };
    if (dto.usuarioId)   obj.usuario   = { id: +dto.usuarioId };
    return this.alertaRepo.save(this.alertaRepo.create(obj));
  }

  async obtenerTodas(filtros?: { estado?: string; tipoProblema?: string }) {
    const q = this.alertaRepo.createQueryBuilder('a')
      .leftJoinAndSelect('a.ubicacion', 'u')
      .leftJoinAndSelect('a.usuario', 'usr')
      .orderBy('a.fechaReporte', 'DESC');
    if (filtros?.estado)       q.andWhere('a.estado = :e',  { e:  filtros.estado });
    if (filtros?.tipoProblema) q.andWhere('a.tipoProblema = :tp', { tp: filtros.tipoProblema });
    return q.getMany();
  }

  // Solo URGENTE + MODERADO para el mapa
  async obtenerParaMapa() {
    return this.alertaRepo.find({
      where: [{ estado: 'URGENTE' }, { estado: 'MODERADO' }],
      relations: ['ubicacion'],
      order: { fechaReporte: 'DESC' },
    });
  }

  async obtenerPorId(id: number) {
    return this.alertaRepo.findOne({ where: { id }, relations: ['ubicacion', 'usuario'] });
  }

  async obtenerPorUbicacion(id: number) {
    return this.alertaRepo.find({
      where: { ubicacion: { id } }, relations: ['ubicacion', 'usuario'],
      order: { fechaReporte: 'DESC' },
    });
  }

  async actualizar(id: number, dto: any) {
    await this.alertaRepo.update(id, dto);
    return this.obtenerPorId(id);
  }

  async resolver(id: number, nota: string) {
    const a = await this.obtenerPorId(id);
    await this.alertaRepo.update(id, {
      estado: 'RESUELTO',
      descripcion: `${a?.descripcion || ''} | Resolución: ${nota}`,
    });
    return this.obtenerPorId(id);
  }

  async eliminar(id: number) { return this.alertaRepo.delete(id); }

  async obtenerEstadisticas() {
    const total = await this.alertaRepo.count();
    const porEstado = await this.alertaRepo.createQueryBuilder('a')
      .select('a.estado','estado').addSelect('COUNT(*)','cantidad')
      .groupBy('a.estado').getRawMany();
    const porProblema = await this.alertaRepo.createQueryBuilder('a')
      .select('a.tipoProblema','tipoProblema').addSelect('COUNT(*)','cantidad')
      .groupBy('a.tipoProblema').getRawMany();
    return { total, porEstado, porProblema };
  }
}