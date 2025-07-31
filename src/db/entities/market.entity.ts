import { Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity';
import { EventEntity } from './event.entity';
import { BookmakerEntity } from './bookmaker.entity';
import { OutcomeEntity } from './outcome.entity';
import { MarketTypeEntity } from './market-type.entity';

@Index('idx_market_key', ['marketType', 'event', 'bookmaker'], { unique: true })
@Entity({ name: 'markets' })
export class MarketEntity extends BaseEntity {
  constructor(data: {
    marketType: MarketTypeEntity;
    event: EventEntity;
    bookmaker: BookmakerEntity;
  }) {
    super();
    Object.assign(this, data);
  }

  @ManyToOne(() => MarketTypeEntity, (event) => event.markets, {
    onDelete: 'CASCADE',
  })
  marketType: MarketTypeEntity;

  @ManyToOne(() => EventEntity, (event) => event.markets, {
    onDelete: 'CASCADE',
  })
  event: EventEntity;

  @ManyToOne(() => BookmakerEntity, (event) => event.markets, {
    onDelete: 'CASCADE',
  })
  bookmaker: BookmakerEntity;

  @OneToMany(() => OutcomeEntity, (outcome) => outcome.market)
  outcomes: OutcomeEntity[];
}
