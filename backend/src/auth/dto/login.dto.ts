import { IsAlphanumeric, IsString, IsStrongPassword } from "class-validator";

export class LoginDto{
    @IsAlphanumeric()
    login:string = '';

    //@IsStrongPassword()
    @IsString()
    pass:string = '';
}