import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity';
import { MarketEntity } from './market.entity';

@Entity({ name: 'market_types' })
export class MarketTypeEntity extends BaseEntity {
  constructor(data: { key: string }) {
    super();
    Object.assign(this, data);
  }

  @Column({ type: 'varchar', length: 100, unique: true })
  key: string;

  @OneToMany(() => MarketEntity, (market) => market.marketType)
  markets: MarketEntity;
}
