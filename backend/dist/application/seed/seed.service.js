"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const usuario_schema_1 = require("../../infrastructure/schemas/usuario.schema");
const producto_schema_1 = require("../../infrastructure/schemas/producto.schema");
const bcryptjs_1 = require("bcryptjs");
let SeedService = class SeedService {
    constructor(usuarioModel, productoModel) {
        this.usuarioModel = usuarioModel;
        this.productoModel = productoModel;
    }
    async onModuleInit() {
        const totalUsuarios = await this.usuarioModel.countDocuments().exec();
        const adminData = {
            nombre: 'Admin Principal',
            email: 'admin@example.com',
            password: (0, bcryptjs_1.hashSync)('admin123', 10),
            avatar: 'https://i.pravatar.cc/150?img=21',
            carnetImagen: 'https://i.pravatar.cc/300?img=21',
            fechaNacimiento: '1980-01-01',
            telefono: '+5491199999999',
            direccion: 'Oficina Central',
            ciudad: 'Buenos Aires',
            pais: 'Argentina',
            descripcion: 'Administrador del sistema.',
            estado: 'VERIFICADO',
            rol: 'ADMIN',
            createdAt: new Date(),
        };
        const superAdminData = {
            nombre: 'Super Admin',
            email: 'super@example.com',
            password: (0, bcryptjs_1.hashSync)('super123', 10),
            avatar: 'https://i.pravatar.cc/150?img=22',
            carnetImagen: 'https://i.pravatar.cc/300?img=22',
            fechaNacimiento: '1975-01-01',
            telefono: '+5491188888888',
            direccion: 'Oficina Ejecutiva',
            ciudad: 'Buenos Aires',
            pais: 'Argentina',
            descripcion: 'Super administrador del sistema.',
            estado: 'VERIFICADO',
            rol: 'SUPERADMIN',
            createdAt: new Date(),
        };
        if (totalUsuarios === 0) {
            const usuarios = [
                {
                    nombre: 'Alicia Ramírez',
                    email: 'alicia@example.com',
                    password: (0, bcryptjs_1.hashSync)('123456', 10),
                    avatar: 'https://i.pravatar.cc/150?img=1',
                    carnetImagen: 'https://i.pravatar.cc/300?img=11',
                    fechaNacimiento: '1992-05-14',
                    telefono: '+5491123456789',
                    direccion: 'Calle 1, 123',
                    ciudad: 'Buenos Aires',
                    pais: 'Argentina',
                    descripcion: 'Vendedora de ropa vintage y accesorios.',
                    estado: 'VERIFICADO',
                    rol: 'USER',
                    createdAt: new Date(),
                },
                {
                    nombre: 'Bruno Díaz',
                    email: 'bruno@example.com',
                    password: (0, bcryptjs_1.hashSync)('123456', 10),
                    avatar: 'https://i.pravatar.cc/150?img=2',
                    carnetImagen: 'https://i.pravatar.cc/300?img=12',
                    fechaNacimiento: '1988-09-23',
                    telefono: '+5491145678901',
                    direccion: 'Av. Libertador 456',
                    ciudad: 'Córdoba',
                    pais: 'Argentina',
                    descripcion: 'Objetos de colección y tecnología usada.',
                    estado: 'VERIFICADO',
                    rol: 'USER',
                    createdAt: new Date(),
                },
                {
                    nombre: 'Camila Torres',
                    email: 'camila@example.com',
                    password: (0, bcryptjs_1.hashSync)('123456', 10),
                    avatar: 'https://i.pravatar.cc/150?img=3',
                    carnetImagen: 'https://i.pravatar.cc/300?img=13',
                    fechaNacimiento: '1995-01-08',
                    telefono: '+5491167890123',
                    direccion: 'Pasaje del Bosque 78',
                    ciudad: 'Rosario',
                    pais: 'Argentina',
                    descripcion: 'Productos para el hogar y decoración.',
                    estado: 'VERIFICADO',
                    rol: 'USER',
                    createdAt: new Date(),
                },
                {
                    nombre: 'Diego Fernández',
                    email: 'diego@example.com',
                    password: (0, bcryptjs_1.hashSync)('123456', 10),
                    avatar: 'https://i.pravatar.cc/150?img=4',
                    carnetImagen: 'https://i.pravatar.cc/300?img=14',
                    fechaNacimiento: '1990-03-30',
                    telefono: '+5491178901234',
                    direccion: 'Ruta 3 Km 12',
                    ciudad: 'Mendoza',
                    pais: 'Argentina',
                    descripcion: 'Artículos deportivos y fitness.',
                    estado: 'VERIFICADO',
                    rol: 'USER',
                    createdAt: new Date(),
                },
                {
                    nombre: 'Elena Guzmán',
                    email: 'elena@example.com',
                    password: (0, bcryptjs_1.hashSync)('123456', 10),
                    avatar: 'https://i.pravatar.cc/150?img=5',
                    carnetImagen: 'https://i.pravatar.cc/300?img=15',
                    fechaNacimiento: '1985-11-11',
                    telefono: '+5491189012345',
                    direccion: 'Calle Falsa 123',
                    ciudad: 'Salta',
                    pais: 'Argentina',
                    descripcion: 'Joyería artesanal y accesorios únicos.',
                    estado: 'VERIFICADO',
                    rol: 'USER',
                    createdAt: new Date(),
                },
                {
                    nombre: 'Federico Moreno',
                    email: 'federico@example.com',
                    password: (0, bcryptjs_1.hashSync)('123456', 10),
                    avatar: 'https://i.pravatar.cc/150?img=6',
                    carnetImagen: 'https://i.pravatar.cc/300?img=16',
                    fechaNacimiento: '1994-07-19',
                    telefono: '+5491190123456',
                    direccion: 'Boulevard 20',
                    ciudad: 'Mar del Plata',
                    pais: 'Argentina',
                    descripcion: 'Electrónica usada y gadgets en buen estado.',
                    estado: 'VERIFICADO',
                    rol: 'USER',
                    createdAt: new Date(),
                },
                {
                    nombre: 'Gabriela Pérez',
                    email: 'gabriela@example.com',
                    password: (0, bcryptjs_1.hashSync)('123456', 10),
                    avatar: 'https://i.pravatar.cc/150?img=7',
                    carnetImagen: 'https://i.pravatar.cc/300?img=17',
                    fechaNacimiento: '1987-02-27',
                    telefono: '+5491102345678',
                    direccion: 'Av. San Martín 987',
                    ciudad: 'Salta',
                    pais: 'Argentina',
                    descripcion: 'Ropa para bebés y juegos educativos.',
                    estado: 'VERIFICADO',
                    rol: 'USER',
                    createdAt: new Date(),
                },
                {
                    nombre: 'Hugo Díaz',
                    email: 'hugo@example.com',
                    password: (0, bcryptjs_1.hashSync)('123456', 10),
                    avatar: 'https://i.pravatar.cc/150?img=8',
                    carnetImagen: 'https://i.pravatar.cc/300?img=18',
                    fechaNacimiento: '1991-06-07',
                    telefono: '+5491113456789',
                    direccion: 'Calle 20',
                    ciudad: 'Neuquén',
                    pais: 'Argentina',
                    descripcion: 'Herramientas y artículos de bricolaje.',
                    estado: 'VERIFICADO',
                    rol: 'USER',
                    createdAt: new Date(),
                },
                {
                    nombre: 'Isabela Ruiz',
                    email: 'isabela@example.com',
                    password: (0, bcryptjs_1.hashSync)('123456', 10),
                    avatar: 'https://i.pravatar.cc/150?img=9',
                    carnetImagen: 'https://i.pravatar.cc/300?img=19',
                    fechaNacimiento: '1993-10-03',
                    telefono: '+5491124567890',
                    direccion: 'Paseo del Bosque 5',
                    ciudad: 'La Plata',
                    pais: 'Argentina',
                    descripcion: 'Libros y material de lectura.',
                    estado: 'VERIFICADO',
                    rol: 'USER',
                    createdAt: new Date(),
                },
                {
                    nombre: 'Javier Soto',
                    email: 'javier@example.com',
                    password: (0, bcryptjs_1.hashSync)('123456', 10),
                    avatar: 'https://i.pravatar.cc/150?img=10',
                    carnetImagen: 'https://i.pravatar.cc/300?img=20',
                    fechaNacimiento: '1989-12-16',
                    telefono: '+5491135678901',
                    direccion: 'Av. Santa Fe 2000',
                    ciudad: 'Buenos Aires',
                    pais: 'Argentina',
                    descripcion: 'Muebles y decoración artesanal.',
                    estado: 'VERIFICADO',
                    rol: 'USER',
                    createdAt: new Date(),
                },
                adminData,
                superAdminData,
            ];
            const usuariosCreados = await this.usuarioModel.insertMany(usuarios);
            const productos = [
                {
                    usuarioId: usuariosCreados[0]._id.toString(),
                    titulo: 'Vestido vintage azul',
                    descripcion: 'Vestido de algodón en excelente estado.',
                    precio: 2500,
                    estado: 'ACTIVO',
                    validado: true,
                    vendedorNombre: usuariosCreados[0].nombre,
                    vendedorAvatar: usuariosCreados[0].avatar,
                },
                {
                    usuarioId: usuariosCreados[1]._id.toString(),
                    titulo: 'Colección de figuras de acción',
                    descripcion: 'Figuras de colección originales.',
                    precio: 9500,
                    estado: 'ACTIVO',
                    validado: true,
                    vendedorNombre: usuariosCreados[1].nombre,
                    vendedorAvatar: usuariosCreados[1].avatar,
                },
                {
                    usuarioId: usuariosCreados[2]._id.toString(),
                    titulo: 'Set de vasos decorativos',
                    descripcion: 'Juego de 6 vasos con diseño moderno.',
                    precio: 4200,
                    estado: 'ACTIVO',
                    validado: true,
                    vendedorNombre: usuariosCreados[2].nombre,
                    vendedorAvatar: usuariosCreados[2].avatar,
                },
                {
                    usuarioId: usuariosCreados[3]._id.toString(),
                    titulo: 'Bicicleta urbana usada',
                    descripcion: 'Bicicleta en buen estado para ciudad.',
                    precio: 18000,
                    estado: 'ACTIVO',
                    validado: true,
                    vendedorNombre: usuariosCreados[3].nombre,
                    vendedorAvatar: usuariosCreados[3].avatar,
                },
                {
                    usuarioId: usuariosCreados[4]._id.toString(),
                    titulo: 'Collar artesanal',
                    descripcion: 'Collar hecho a mano, ideal para regalo.',
                    precio: 1500,
                    estado: 'ACTIVO',
                    validado: true,
                    vendedorNombre: usuariosCreados[4].nombre,
                    vendedorAvatar: usuariosCreados[4].avatar,
                },
                {
                    usuarioId: usuariosCreados[5]._id.toString(),
                    titulo: 'Celular en excelente estado',
                    descripcion: 'Smartphone usado, con funda y cargador.',
                    precio: 32000,
                    estado: 'ACTIVO',
                    validado: true,
                    vendedorNombre: usuariosCreados[5].nombre,
                    vendedorAvatar: usuariosCreados[5].avatar,
                },
                {
                    usuarioId: usuariosCreados[6]._id.toString(),
                    titulo: 'Set de juguetes didácticos',
                    descripcion: 'Juegos educativos para niños pequeños.',
                    precio: 2200,
                    estado: 'ACTIVO',
                    validado: true,
                    vendedorNombre: usuariosCreados[6].nombre,
                    vendedorAvatar: usuariosCreados[6].avatar,
                },
                {
                    usuarioId: usuariosCreados[7]._id.toString(),
                    titulo: 'Kit de herramientas manuales',
                    descripcion: 'Herramientas para pequeños arreglos en casa.',
                    precio: 6000,
                    estado: 'ACTIVO',
                    validado: true,
                    vendedorNombre: usuariosCreados[7].nombre,
                    vendedorAvatar: usuariosCreados[7].avatar,
                },
                {
                    usuarioId: usuariosCreados[8]._id.toString(),
                    titulo: 'Paquete de libros de novela',
                    descripcion: 'Libros en buen estado, lectura variada.',
                    precio: 4500,
                    estado: 'ACTIVO',
                    validado: true,
                    vendedorNombre: usuariosCreados[8].nombre,
                    vendedorAvatar: usuariosCreados[8].avatar,
                },
                {
                    usuarioId: usuariosCreados[9]._id.toString(),
                    titulo: 'Mesa pequeña de madera',
                    descripcion: 'Mesa auxiliar ideal para el living.',
                    precio: 7200,
                    estado: 'ACTIVO',
                    validado: true,
                    vendedorNombre: usuariosCreados[9].nombre,
                    vendedorAvatar: usuariosCreados[9].avatar,
                },
            ];
            await this.productoModel.insertMany(productos);
            console.log('Seed de usuarios y productos creado con 10 usuarios y sus artículos.');
            return;
        }
        const adminExistente = await this.usuarioModel.findOne({ email: adminData.email }).exec();
        if (!adminExistente) {
            await this.usuarioModel.create(adminData);
            console.log('Admin creado: admin@example.com / admin123');
        }
        const superAdminExistente = await this.usuarioModel.findOne({ email: superAdminData.email }).exec();
        if (!superAdminExistente) {
            await this.usuarioModel.create(superAdminData);
            console.log('Superadmin creado: super@example.com / super123');
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(usuario_schema_1.Usuario.name)),
    __param(1, (0, mongoose_1.InjectModel)(producto_schema_1.Producto.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SeedService);
//# sourceMappingURL=seed.service.js.map