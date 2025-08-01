import { Module } from '@nestjs/common';
import { OddsSyncService } from './services/odds-sync.service';
import { DbModule } from '../db/db.module';
import { HttpModule } from '@nestjs/axios';
import { TheOddsApiService } from './services/the-odds-api.service';
import { OddsSyncCronService } from './services/odds-sync.cron.service';
import { OddsMapperService } from './services/odds-mapper.service';

@Module({
  imports: [DbModule, HttpModule],
  providers: [OddsSyncService, TheOddsApiService, OddsSyncCronService, OddsMapperService],
  exports: [OddsSyncService, TheOddsApiService],
})
export class OddsSyncModule {}
