import { BookmakerEntity } from '../../db/entities/bookmaker.entity';
import { EventEntity } from '../../db/entities/event.entity';
import { MarketTypeEntity } from '../../db/entities/market-type.entity';
import { MarketEntity } from '../../db/entities/market.entity';
import { OutcomeEntity } from '../../db/entities/outcome.entity';
import { TheOddsApiEvent } from '../types/odds-api.type';

export class OddsMapperService {
  // Maps the odds data from the API to the respective entities
  // This method is responsible for transforming the raw data into the format expected by the database.
  oddsDataToEntities(
    eventsData: TheOddsApiEvent[],
  ): [EventEntity[], BookmakerEntity[], MarketTypeEntity[], MarketEntity[], OutcomeEntity[]] {
    const eventEntities: EventEntity[] = [];
    const bookmakerMap = new Map<string, BookmakerEntity>();
    const marketTypeMap = new Map<string, MarketTypeEntity>();
    const marketEntities: MarketEntity[] = [];
    const outcomeEntities: OutcomeEntity[] = [];

    for (const eventData of eventsData) {
      const eventEntity = new EventEntity({
        eventId: eventData.id,
        sportKey: eventData.sport_key,
        sportTitle: eventData.sport_title,
        commenceTime: new Date(eventData.commence_time),
        homeTeam: eventData.home_team,
        awayTeam: eventData.away_team,
      });

      eventEntities.push(eventEntity);

      for (const bookmakerData of eventData.bookmakers) {
        if (!bookmakerMap.has(bookmakerData.key)) {
          const bookmakerEntity = new BookmakerEntity({
            name: bookmakerData.title,
            key: bookmakerData.key,
          });
          bookmakerMap.set(bookmakerData.key, bookmakerEntity);
        }

        for (const marketData of bookmakerData.markets) {
          if (!marketTypeMap.has(marketData.key)) {
            const marketTypeEntity = new MarketTypeEntity({
              key: marketData.key,
            });
            marketTypeMap.set(marketData.key, marketTypeEntity);
          }

          const marketEntity = new MarketEntity({
            marketType: marketTypeMap.get(marketData.key)!,
            event: eventEntity,
            bookmaker: bookmakerMap.get(bookmakerData.key)!,
          });

          marketEntities.push(marketEntity);

          for (const outcomeData of marketData.outcomes) {
            const outcomeEntity = new OutcomeEntity({
              name: outcomeData.name,
              price: outcomeData.price,
              market: marketEntity,
            });
            outcomeEntities.push(outcomeEntity);
          }
        }
      }
    }

    return [
      eventEntities,
      Array.from(bookmakerMap.values()),
      Array.from(marketTypeMap.values()),
      marketEntities,
      outcomeEntities,
    ];
  }
}
