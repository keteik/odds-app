import { Injectable } from '@nestjs/common';
import { OddsSyncService } from './odds-sync.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class OddsSyncCronService {
  constructor(private readonly oddsSyncService: OddsSyncService) {}

  // Cron job to sync odds data every 5 minutes
  @Cron('0 */5 * * * *')
  async syncOddsData(): Promise<void> {
    try {
      await this.oddsSyncService.syncOddsData();
    } catch (error) {
      console.error(`Error syncing odds data`, error);
    }
  }
}
