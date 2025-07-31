import { InjectRepository } from '@nestjs/typeorm';
import { OutcomeEntity } from '../entities/outcome.entity';
import { Repository } from 'typeorm';

export class OutcomeRepositoryService {
  constructor(
    @InjectRepository(OutcomeEntity)
    readonly outcomeRepository: Repository<OutcomeEntity>,
  ) {}
}
