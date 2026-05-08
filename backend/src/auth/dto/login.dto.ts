import { IsAlphanumeric, IsString } from "class-validator"

export class LoginDto {
    @IsAlphanumeric()
    login: string = ''

    @IsString()
    pass: string = ''
}