import { Module } from '@nestjs/common';
import { DataBaseModule } from './database/config/database-config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { TemplatesModule } from './templates/templates.module';

@Module({
  imports: [DataBaseModule, UsersModule, AuthModule, CarsModule, TemplatesModule],
})
export class AppModule {}
