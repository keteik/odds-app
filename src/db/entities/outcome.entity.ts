import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from './base-entity';
import { MarketEntity } from './market.entity';

@Index('idx_outcome_name', ['name', 'market'], { unique: true })
@Entity({ name: 'outcomes' })
export class OutcomeEntity extends BaseEntity {
  constructor(data: { name: string; price: number; market: MarketEntity }) {
    super();
    Object.assign(this, data);
  }

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => MarketEntity, (market) => market.outcomes)
  market: MarketEntity;
}
