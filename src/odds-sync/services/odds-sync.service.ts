import { Injectable } from '@nestjs/common';
import { EventRepositoryService } from '../../db/providers/event.repository.service';
import { TheOddsApiEvent } from '../types/odds-api.type';
import { OddsMapperService } from './odds-mapper.service';

@Injectable()
export class OddsSyncService {
  constructor(
    private readonly eventRepositoryService: EventRepositoryService,
    private readonly oddsMapperService: OddsMapperService,
  ) {}

  // Processes the odds data from the API and syncs it with the database
  async syncOddsData(eventsData: TheOddsApiEvent[]) {
    // Mapping the odds data to entities
    const [eventEntities, bookmakers, marketTypes, markets, outcomes] =
      this.oddsMapperService.oddsDataToEntities(eventsData);

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
