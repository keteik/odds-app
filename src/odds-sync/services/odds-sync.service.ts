import { Injectable } from '@nestjs/common';
import { EventRepositoryService } from '../../db/providers/event.repository.service';
import { OddsMapperService } from './odds-mapper.service';
import { BookmakerEntity } from '../../db/entities/bookmaker.entity';
import { MarketTypeEntity } from '../../db/entities/market-type.entity';
import { EventEntity } from '../../db/entities/event.entity';
import { MarketEntity } from '../../db/entities/market.entity';
import { OutcomeEntity } from '../../db/entities/outcome.entity';
import { TheOddsApiService } from './the-odds-api.service';
import { ConfigService } from '@nestjs/config';
import { EnvSchema } from '../../config/env.config';
import { OddsSheetService } from '../../odds-sheet/services/odds-sheet.service';

@Injectable()
export class OddsSyncService {
  constructor(
    private readonly eventRepositoryService: EventRepositoryService,
    private readonly oddsMapperService: OddsMapperService,
    private readonly theOddsApiService: TheOddsApiService,
    private readonly configService: ConfigService<EnvSchema>,
    private readonly oddsSheetService: OddsSheetService,
  ) {}

  get sportKey(): string {
    return this.configService.get<string>('THE_ODDS_API_SPORT_KEY')!;
  }

  get regions(): string[] {
    return this.configService.get<string>('THE_ODDS_API_REGIONS')!.split(',');
  }

  // Processes the odds data from the API and syncs it with the database
  async syncOddsData() {
    console.log(`[${new Date().toISOString()}] Starting odds data sync for sport key: ${this.sportKey}`);

    const eventsData = await this.theOddsApiService.fetchEvents(this.sportKey, this.regions);
    console.log(`[${new Date().toISOString()}] Fetched ${eventsData.length} events for sport key: ${this.sportKey}`);

    // Mapping the odds data to entities
    const [eventEntities, bookmakers, marketTypes, markets, outcomes] =
      this.oddsMapperService.oddsDataToEntities(eventsData);

    // Save the mapped entities to the database
    await this.syncWithDb(bookmakers, marketTypes, eventEntities, markets, outcomes);
    console.log(
      `[${new Date().toISOString()}] Synced ${eventEntities.length} events, ${bookmakers.length} bookmakers, ${marketTypes.length} market types, ${markets.length} markets, and ${outcomes.length} outcomes for sport key: ${this.sportKey}`,
    );

    // Sync the odds data with Google Sheets
    await this.oddsSheetService.syncOddsSheet();
    console.log(`[${new Date().toISOString()}] Synced odds sheet with Google Sheets`);

    console.log(`[${new Date().toISOString()}] Completed odds data sync for sport key: ${this.sportKey}`);
  }

  async syncWithDb(
    bookmakers: BookmakerEntity[],
    marketTypes: MarketTypeEntity[],
    eventEntities: EventEntity[],
    markets: MarketEntity[],
    outcomes: OutcomeEntity[],
  ) {
    // Upserting the data into the database
    await this.eventRepositoryService.syncEvents(
      {
        entities: bookmakers,
        overwrite: ['name', 'updated_at'],
        conflictTarget: ['key'],
        returning: ['id', 'updated_at'],
      },
      {
        entities: marketTypes,
        overwrite: ['updated_at'],
        conflictTarget: ['key'],
        returning: ['id', 'updated_at'],
      },
      {
        entities: eventEntities,
        overwrite: ['updated_at', 'sport_key', 'sport_title', 'commence_time', 'home_team', 'away_team', 'deleted_at'],
        conflictTarget: ['event_id'],
        returning: ['id', 'event_id'],
      },
      {
        entities: markets,
        overwrite: ['updated_at'],
        conflictTarget: ['market_type_id', 'event_id', 'bookmaker_id'],
        returning: ['id', 'updated_at'],
      },
      {
        entities: outcomes,
        overwrite: ['name', 'price', 'updated_at'],
        conflictTarget: ['name', 'market_id'],
        returning: ['id', 'updated_at'],
      },
    );
  }
}
