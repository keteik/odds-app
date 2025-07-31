import { Injectable } from '@nestjs/common';
import { TheOddsApiService } from './the-odds-api.service';
import { OddsSyncService } from './odds-sync.service';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OddsSyncCronService {
  constructor(
    private readonly theOddsApiService: TheOddsApiService,
    private readonly oddsSyncService: OddsSyncService,
    private readonly configService: ConfigService,
  ) {}

  get sportKey(): string {
    return this.configService.get<string>('THE_ODDS_API_SPORT_KEY')!;
  }

  get regions(): string[] {
    return this.configService.get<string>('THE_ODDS_API_REGIONS')!.split(',');
  }

  // Cron job to sync odds data every 5 minutes
  // @Cron('0 */5 * * * *')
  @Cron('*/20 * * * * *')
  async syncOddsData(): Promise<void> {
    console.log(`[${new Date().toISOString()}] Starting odds data sync for sport key: ${this.sportKey}`);

    try {
      const eventsData = await this.theOddsApiService.fetchEvents(this.sportKey, this.regions);
      console.log(`Fetched ${eventsData.length} events for sport key: ${this.sportKey}`);

      await this.oddsSyncService.syncOddsData(eventsData);
    } catch (error) {
      console.error(`Error fetching events for sport key ${this.sportKey}:`, error);
    }

    console.log(`[${new Date().toISOString()}] Completed odds data sync for sport key: ${this.sportKey}`);
  }
}
