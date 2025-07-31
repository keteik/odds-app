import { Injectable } from '@nestjs/common';
import { BookmakerEntity } from '../../../db/entities/bookmaker.entity';
import { EventEntity } from '../../../db/entities/event.entity';
import { MarketTypeEntity } from '../../../db/entities/market-type.entity';
import { MarketEntity } from '../../../db/entities/market.entity';
import { OutcomeEntity } from '../../../db/entities/outcome.entity';
import { EventRepositoryService } from '../../../db/providers/event.repository.service';
import { OddsApiEvent } from '../types/odds-api.type';
import { BookmakerRepositoryService } from '../../../db/providers/bookmaker.repository.service';
import { MarketTypeRepositoryService } from '../../../db/providers/market-type.repository.service';
import { MarketRepositoryService } from '../../../db/providers/market.repository.service';
import { OutcomeRepositoryService } from '../../../db/providers/outcome.repository.service';
import { DataSource, In, Not } from 'typeorm';

@Injectable()
export class OddsSyncService {
  constructor(
    private readonly eventRepositoryService: EventRepositoryService,
    private readonly bookmakerRepositoryService: BookmakerRepositoryService,
    private readonly marketTypeRepositoryService: MarketTypeRepositoryService,
    private readonly marketRepositoryService: MarketRepositoryService,
    private readonly outcomeRepositoryService: OutcomeRepositoryService,
    private readonly dataSource: DataSource,
  ) {}

  mapOddsDataToEntities(
    eventsData: OddsApiEvent[],
  ): [
    EventEntity[],
    BookmakerEntity[],
    MarketTypeEntity[],
    MarketEntity[],
    OutcomeEntity[],
  ] {
    const eventEntities: EventEntity[] = [];
    const bookmakerMap = new Map<string, BookmakerEntity>();
    const marketTypeMap = new Map<string, MarketTypeEntity>();
    const marketEntities: MarketEntity[] = [];
    const outcomeEntities: OutcomeEntity[] = [];

    for (const eventData of eventsData) {
      const eventEntity = new EventEntity({
        eventId: eventData.id,
        sportKey: eventData.sport_key,
        sportTitle: eventData.sport_title,
        commenceTime: new Date(eventData.commence_time),
        homeTeam: eventData.home_team,
        awayTeam: eventData.away_team,
      });

      eventEntities.push(eventEntity);

      for (const bookmakerData of eventData.bookmakers) {
        if (!bookmakerMap.has(bookmakerData.key)) {
          const bookmakerEntity = new BookmakerEntity({
            name: bookmakerData.title,
            key: bookmakerData.key,
          });
          bookmakerMap.set(bookmakerData.key, bookmakerEntity);
        }

        for (const marketData of bookmakerData.markets) {
          if (!marketTypeMap.has(marketData.key)) {
            const marketTypeEntity = new MarketTypeEntity({
              key: marketData.key,
            });
            marketTypeMap.set(marketData.key, marketTypeEntity);
          }

          marketEntities.push(
            new MarketEntity({
              marketType: marketTypeMap.get(marketData.key)!,
              event: eventEntity,
              bookmaker: bookmakerMap.get(bookmakerData.key)!,
            }),
          );

          for (const outcomeData of marketData.outcomes) {
            const outcomeEntity = new OutcomeEntity({
              name: outcomeData.name,
              price: outcomeData.price,
              market: marketEntities[marketEntities.length - 1],
            });
            outcomeEntities.push(outcomeEntity);
          }
        }
      }
    }

    return [
      eventEntities,
      Array.from(bookmakerMap.values()),
      Array.from(marketTypeMap.values()),
      marketEntities,
      outcomeEntities,
    ];
  }

  async syncOddsData(eventsData: OddsApiEvent[]) {
    // This method would typically fetch data from an external API,
    // map it using the `mapOddsDataToEntities` method, and then save
    // the entities to the database using the respective repository services.

    const [eventEntities, bookmakers, marketTypes, markets, outcomes] =
      this.mapOddsDataToEntities(eventsData);

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(BookmakerEntity)
        .values(bookmakers)
        .orUpdate(['name', 'updated_at'], ['key'])
        .returning(['id', 'updated_at'])
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(MarketTypeEntity)
        .values(marketTypes)
        .orUpdate(['updated_at'], ['key'])
        .returning(['id', 'updated_at'])
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(EventEntity)
        .values(eventEntities)
        .orUpdate(
          [
            'updated_at',
            'sport_key',
            'sport_title',
            'commence_time',
            'home_team',
            'away_team',
            'deleted_at',
          ],
          ['event_id'],
        )
        .returning(['id', 'updated_at'])
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(MarketEntity)
        .values(markets)
        .orUpdate(
          ['updated_at'],
          ['market_type_id', 'event_id', 'bookmaker_id'],
        )
        .returning(['id', 'updated_at'])
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(OutcomeEntity)
        .values(outcomes)
        .orUpdate(['name', 'price', 'updated_at'], ['name', 'market_id'])
        .returning(['id', 'updated_at'])
        .execute();

      await queryRunner.manager.softDelete(EventEntity, {
        eventId: Not(In(eventEntities.map((e) => e.eventId))),
        sportKey: In(eventEntities.map((e) => e.sportKey)),
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error during transaction:', error);
    } finally {
      await queryRunner.release();
    }
  }
}
