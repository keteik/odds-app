import { Module } from '@nestjs/common';
import { OddsModule } from './odds/odds.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmPostgresConfig } from '../config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from '../config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    TypeOrmModule.forRootAsync(typeOrmPostgresConfig),
    OddsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
