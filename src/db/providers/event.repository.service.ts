import { Repository } from 'typeorm';
import { EventEntity } from '../entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class EventRepositoryService {
  constructor(
    @InjectRepository(EventEntity)
    readonly eventRepository: Repository<EventEntity>,
  ) {}
}
