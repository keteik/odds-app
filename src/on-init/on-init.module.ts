import { Module } from '@nestjs/common';
import { OnInitService } from './services/on-init.service';
import { OddsSyncModule } from '../odds-sync/odds-sync.module';

@Module({
  providers: [OnInitService],
  imports: [OddsSyncModule],
})
export class OnInitModule {}
