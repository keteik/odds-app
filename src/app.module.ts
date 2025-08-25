import { Module } from '@nestjs/common';
import { OddsSyncModule } from './odds-sync/odds-sync.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmPostgresConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env.config';
import { DbModule } from './db/db.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OddsSheetModule } from './odds-sheet/odds-sheet.module';
import { OnInitModule } from './on-init/on-init.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    TypeOrmModule.forRootAsync(typeOrmPostgresConfig),
    ScheduleModule.forRoot(),
    DbModule,
    OddsSyncModule,
    OddsSheetModule,
    OnInitModule,
    LogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
