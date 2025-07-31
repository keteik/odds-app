import { ObjectLiteral, Repository } from 'typeorm';

export abstract class BaseRepositoryService<T extends ObjectLiteral> {
  constructor(private readonly _repository: Repository<T>) {}
}
