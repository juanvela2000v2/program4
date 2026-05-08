import { IsAlphanumeric, IsNotEmpty, IsOptional, IsString, IsDateString, IsBoolean } from "class-validator"

export class RegistroDto {
    @IsString()
    @IsNotEmpty()
    nombre: string = ''

    @IsString()
    @IsNotEmpty()
    apellidoPaterno: string = ''

    @IsString()
    @IsNotEmpty()
    apellidoMaterno: string = ''

    @IsString()
    @IsNotEmpty()
    ci: string = ''

    @IsDateString()
    @IsNotEmpty()
    fechaNacimiento: string = ''

    @IsString()
    @IsNotEmpty()
    sexo: string = ''

    @IsString()
    @IsNotEmpty()
    direccion: string = ''

    @IsString()
    @IsNotEmpty()
    telefono: string = ''

    @IsString()
    @IsOptional()
    correo?: string

    @IsString()
    @IsOptional()
    codigoAsegurado?: string

    @IsBoolean()
    @IsOptional()
    esAsegurado?: boolean

    @IsAlphanumeric()
    login: string = ''

    @IsString()
    pass: string = ''
}