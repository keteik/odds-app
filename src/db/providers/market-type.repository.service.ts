import { InjectRepository } from '@nestjs/typeorm';
import { MarketTypeEntity } from '../entities/market-type.entity';
import { Repository } from 'typeorm';

export class MarketTypeRepositoryService {
  constructor(
    @InjectRepository(MarketTypeEntity)
    readonly marketTypeRepository: Repository<MarketTypeEntity>,
  ) {}
}
