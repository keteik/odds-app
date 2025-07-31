import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { BookmakerEntity } from './entities/bookmaker.entity';
import { MarketTypeEntity } from './entities/market-type.entity';
import { MarketEntity } from './entities/market.entity';
import { OutcomeEntity } from './entities/outcome.entity';
import { EventRepositoryService } from './providers/event.repository.service';
import { BookmakerRepositoryService } from './providers/bookmaker.repository.service';
import { MarketRepositoryService } from './providers/market.repository.service';
import { MarketTypeRepositoryService } from './providers/market-type.repository.service';
import { OutcomeRepositoryService } from './providers/outcome.repository.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventEntity,
      BookmakerEntity,
      MarketTypeEntity,
      MarketEntity,
      OutcomeEntity,
    ]),
  ],
  providers: [
    EventRepositoryService,
    BookmakerRepositoryService,
    MarketRepositoryService,
    MarketTypeRepositoryService,
    OutcomeRepositoryService,
  ],
  exports: [
    EventRepositoryService,
    BookmakerRepositoryService,
    MarketRepositoryService,
    MarketTypeRepositoryService,
    OutcomeRepositoryService,
  ],
})
export class DbModule {}
