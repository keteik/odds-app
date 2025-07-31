import { DataSource, In, Not, Repository } from 'typeorm';
import { EventEntity } from '../entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpsertData } from '../types/typeorm.type';
import { BookmakerEntity } from '../entities/bookmaker.entity';
import { MarketTypeEntity } from '../entities/market-type.entity';
import { MarketEntity } from '../entities/market.entity';
import { OutcomeEntity } from '../entities/outcome.entity';

export class EventRepositoryService {
  constructor(
    @InjectRepository(EventEntity)
    readonly eventRepository: Repository<EventEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // Generic method to create an upsert query builder for any entity type
  private upsertQueryBuilder<T>(entity: new (data: T) => T, data: UpsertData<T>) {
    return this.dataSource
      .getRepository(entity)
      .createQueryBuilder()
      .insert()
      .values(data.entities)
      .orUpdate(data.overwrite, data.conflictTarget)
      .returning(data.returning);
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
      await Promise.all([
        this.upsertQueryBuilder(BookmakerEntity, bookmakers).execute(),
        this.upsertQueryBuilder(MarketTypeEntity, marketTypes).execute(),
        this.upsertQueryBuilder(EventEntity, events).execute(),
      ]);

      await this.upsertQueryBuilder(MarketEntity, markets).execute();
      await this.upsertQueryBuilder(OutcomeEntity, outcomes).execute();

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
