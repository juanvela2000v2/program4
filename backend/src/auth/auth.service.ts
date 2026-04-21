import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    //npm install --save bcrypt
    //npm install --save -D @types/bcrypt
    //npm i --save @nestjs/jwt
    constructor(
        private readonly usersService:UsersService,
        private jwtService: JwtService
    ){}
    async signIn(login:string,password:string){

        //const Pass = await bcrypt.hashSync(password,parseInt(process.env.ENCRYPT_SALT||'10'))
        //console.log(Pass)
        
        const user = await this.usersService.getUserByLogin(login);
        //console.log(user)
        if(!user)
            throw new UnauthorizedException();
        const comparePass = bcrypt.compareSync(password,user.pass)
        if(!comparePass)
            throw new UnauthorizedException();
        const payload = {
            user:user.id,
            nombre:user.nombre,
            login:user.login,
        }
        const token = this.jwtService.sign(payload);
        return {
            access_token:token,
        }
    }
}
