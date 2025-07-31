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
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(BookmakerEntity)
        .values(bookmakers.entities)
        .orUpdate(bookmakers.overwrite, bookmakers.conflictTarget)
        .returning(bookmakers.returning)
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(MarketTypeEntity)
        .values(marketTypes.entities)
        .orUpdate(marketTypes.overwrite, marketTypes.conflictTarget)
        .returning(marketTypes.returning)
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(EventEntity)
        .values(events.entities)
        .orUpdate(events.overwrite, events.conflictTarget)
        .returning(events.returning)
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(MarketEntity)
        .values(markets.entities)
        .orUpdate(markets.overwrite, markets.conflictTarget)
        .returning(markets.returning)
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(OutcomeEntity)
        .values(outcomes.entities)
        .orUpdate(outcomes.overwrite, outcomes.conflictTarget)
        .returning(outcomes.returning)
        .execute();

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
