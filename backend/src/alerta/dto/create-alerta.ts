// Estos DTOs ya no se usan activamente (usamos "any" en los controllers)
// Los dejamos para no romper imports existentes
export class CreateAlertaDto {
  tipoProblema: string = '';
  descripcion?: string;
  estado?: string;
  ubicacionId?: number;
}

export class UpdateAlertaDto {
  estado?: 'URGENTE' | 'MODERADO' | 'RESUELTO';
  descripcion?: string;
}