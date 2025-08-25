import { Injectable } from '@nestjs/common';
import { OddsSyncService } from './odds-sync.service';
import { Cron } from '@nestjs/schedule';
import { ConsoleLogService } from 'src/log/services/console-log.service';

@Injectable()
export class OddsSyncCronService {
  constructor(
    private readonly oddsSyncService: OddsSyncService,
    private readonly consoleLogService: ConsoleLogService,
  ) {}

  // Cron job to sync odds data every 5 minutes
  @Cron('0 */5 * * * *')
  async syncOddsData(): Promise<void> {
    try {
      await this.oddsSyncService.syncOddsData();
    } catch (error) {
      this.consoleLogService.error(`Error syncing odds data`, error);
    }
  }
}
