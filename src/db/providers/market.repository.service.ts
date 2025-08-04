import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketEntity } from '../entities/market.entity';

export class MarketRepositoryService {
  constructor(@InjectRepository(MarketEntity) private readonly marketRepository: Repository<MarketEntity>) {}

  async findAllBySportKey(sportKey: string): Promise<MarketEntity[]> {
    return await this.marketRepository
      .createQueryBuilder('market')
      .innerJoin('market.event', 'event')
      .innerJoin('market.marketType', 'marketType')
      .innerJoin('market.outcomes', 'outcomes')
      .innerJoin('market.bookmaker', 'bookmaker')
      .select(['market.id'])
      .addSelect(['event.id', 'event.sportTitle', 'event.commenceTime', 'event.homeTeam', 'event.awayTeam'])
      .addSelect(['marketType.id', 'marketType.key'])
      .addSelect(['bookmaker.id', 'bookmaker.name'])
      .addSelect(['outcomes.id', 'outcomes.name', 'outcomes.price'])
      .where('event.sportKey = :sportKey', { sportKey })
      .orderBy('event.commenceTime', 'ASC')
      .getMany();
  }
}
