import { Column, DeleteDateColumn, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity';
import { MarketEntity } from './market.entity';

@Index('event_sportKey_index', ['sportKey'])
@Index('event_not_deleted_index', ['deletedAt'], { where: '"deleted_at" IS NULL' })
@Entity({ name: 'events' })
export class EventEntity extends BaseEntity {
  constructor(data: {
    eventId: string;
    sportKey: string;
    sportTitle: string;
    commenceTime: Date;
    homeTeam: string;
    awayTeam: string;
  }) {
    super();
    Object.assign(this, data);
  }

  @Column({ type: 'varchar', length: 32, unique: true })
  eventId: string;

  @Column({ type: 'varchar', length: 100 })
  sportKey: string;

  @Column({ type: 'varchar', length: 100 })
  sportTitle: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'timestamp' })
  commenceTime: Date;

  @Column({ type: 'varchar', length: 100 })
  homeTeam: string;

  @Column({ type: 'varchar', length: 100 })
  awayTeam: string;

  @OneToMany(() => MarketEntity, (market) => market.event)
  markets: MarketEntity[];
}
