import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BookmakerEntity } from '../entities/bookmaker.entity';

export class BookmakerRepositoryService {
  constructor(
    @InjectRepository(BookmakerEntity)
    private readonly bookmakerRepository: Repository<BookmakerEntity>,
  ) {}

  async upsert(
    bookmakers: BookmakerEntity[],
    overwrite: string[],
    conflictTarget: string[],
  ) {
    return await this.bookmakerRepository
      .createQueryBuilder()
      .insert()
      .values(bookmakers)
      .orUpdate(overwrite, conflictTarget)
      .returning(['id'])
      .execute();
  }
}
