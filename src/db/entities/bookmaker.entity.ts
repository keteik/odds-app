import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity';
import { MarketEntity } from './market.entity';

@Entity({ name: 'bookmakers' })
export class BookmakerEntity extends BaseEntity {
  constructor(data: { name: string; key: string }) {
    super();
    Object.assign(this, data);
  }

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  key: string;

  @OneToMany(() => MarketEntity, (market) => market.bookmaker)
  markets: MarketEntity[];
}
