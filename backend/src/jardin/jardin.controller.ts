import { Body, Controller, Get, Injectable, ParseIntPipe, Post, Query } from '@nestjs/common';
import { JardinService } from './jardin.service';
import { Int32 } from 'typeorm';
import { CreateJardinDto } from './dto/createJardin.dto';

@Injectable()
@Controller('jardin')
export class JardinController {
    constructor(
        private readonly jardinService:JardinService
    ){}

    //post ->crear
    //get-> lista ->buscar
    //put/patch  ->edit
    //delete ->borrar


    //dominio.com/jardin?page=2&limit=10&search=papa 🎈
    //dominio.com/jardin/2/10/papa  ✖️
    @Get()
    findAll(
        @Query('page') page=1,
        @Query('limit') limit=10,
        @Query('search') search:string=''
    ){
        return this.jardinService.getAll(page,limit,search);
    }
    @Post()
    create(@Body() dto:CreateJardinDto){
        return this.jardinService.create(dto);
    }
    

}
