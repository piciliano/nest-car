import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { env } from 'src/env/z-env';
import { User } from "../entities/user-entity";
import { Car } from "../entities/car-entity";
import { Templates } from "../entities/file.entity";


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: env.DB_HOST,
            port: env.DB_PORT,
            username: env.DB_USERNAME,
            password: env.DB_PASSWORD,
            database: env.DB_NAME,
            entities: [User, Car, Templates],
            synchronize: true
        })
    ]
})

export class DataBaseModule {}