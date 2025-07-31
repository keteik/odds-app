import { Module } from '@nestjs/common';
import { OddsSyncController } from './controllers/odds-sync.controller';
import { OddsSyncService } from './services/odds-sync.service';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [OddsSyncController],
  providers: [OddsSyncService],
})
export class OddsSyncModule {}
