import { InjectRepository } from '@nestjs/typeorm';
import { MarketEntity } from '../entities/market.entity';
import { Repository } from 'typeorm';

export class MarketRepositoryService {
  constructor(
    @InjectRepository(MarketEntity)
    readonly marketRepository: Repository<MarketEntity>,
  ) {}
}
