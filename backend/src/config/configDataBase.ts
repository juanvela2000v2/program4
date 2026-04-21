import { UserEntity } from "src/models/user/user";

export const configDB = {
      type: (process.env.DATABASE_TYPE as 'mysql')||'mysql',
      host: process.env.DATABASE_HOST || 'localhost111',
      port: parseInt(process.env.DATABASE_PORT|| '3306',10),
      username: process.env.DATABASE_USER|| 'root',
      password: process.env.DATABASE_PASSWORD|| '',
      database: process.env.DATABASE_NAME ||'jardinDB',
      entities: [UserEntity],
      synchronize: false,//solo para dev true
    }