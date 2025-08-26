import { DataSource, In, Not, Repository } from 'typeorm';
import { EventEntity } from '../entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpsertData } from '../types/typeorm.type';
import { BookmakerEntity } from '../entities/bookmaker.entity';
import { MarketTypeEntity } from '../entities/market-type.entity';
import { MarketEntity } from '../entities/market.entity';
import { OutcomeEntity } from '../entities/outcome.entity';
import { QueryRunner } from 'typeorm/browser';

export class EventRepositoryService {
  constructor(
    @InjectRepository(EventEntity)
    readonly eventRepository: Repository<EventEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // Generic method to create an upsert query builder for any entity type
  private async upsert<T>(
    queryRunner: QueryRunner,
    entity: new (data: T) => T,
    data: UpsertData<T>,
    batchSize: number = 1000,
  ) {
    for (let i = 0; i < data.entities.length; i += batchSize) {
      const batch = data.entities.slice(i, i + batchSize);
      await queryRunner.manager
        .getRepository(entity)
        .createQueryBuilder()
        .insert()
        .values(batch)
        .orUpdate(data.overwrite, data.conflictTarget)
        .returning(data.returning)
        .execute();
    }
  }

  /**
   * Synchronizes events, markets, outcomes, and bookmakers in the database.
   * This method performs an upsert operation for each entity type and soft deletes
   * events that are no longer present for the same sport.
   *
   * @param bookmakers - Upsert data for bookmakers.
   * @param marketTypes - Upsert data for market types.
   * @param events - Upsert data for events.
   * @param markets - Upsert data for markets.
   * @param outcomes - Upsert data for outcomes.
   */
  async syncEvents(
    bookmakers: UpsertData<BookmakerEntity>,
    marketTypes: UpsertData<MarketTypeEntity>,
    events: UpsertData<EventEntity>,
    markets: UpsertData<MarketEntity>,
    outcomes: UpsertData<OutcomeEntity>,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Upsert bookmakers, market types, events, markets, and outcomes
      await this.upsert(queryRunner, BookmakerEntity, bookmakers);
      await this.upsert(queryRunner, MarketTypeEntity, marketTypes);
      await this.upsert(queryRunner, EventEntity, events);
      await this.upsert(queryRunner, MarketEntity, markets);
      await this.upsert(queryRunner, OutcomeEntity, outcomes);

      // Soft delete events that are no longer present for the same sport
      // This ensures that we only keep the events that are currently active.
      await queryRunner.manager.softDelete(EventEntity, {
        eventId: Not(In(events.entities.map((e) => e.eventId))),
        sportKey: In(events.entities.map((e) => e.sportKey)),
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
