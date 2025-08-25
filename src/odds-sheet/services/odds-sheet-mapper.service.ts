import { ConfigService } from '@nestjs/config';
import { MarketEntity } from '../../db/entities/market.entity';
import { SheetRow } from '../types/odds-sheet.type';
import { EnvSchema } from '../../config/env.config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OddsSheetMapperService {
  constructor(private readonly configService: ConfigService<EnvSchema, true>) {}

  get googleSheetName() {
    return this.configService.get('GOOGLE_SHEETS_SHEET_NAME', { infer: true });
  }

  mapEntitiesToSheetData(marketEntities: MarketEntity[]) {
    const sheetValues: string[][] = [
      ['Event Name', 'Commence Time', 'Bookmaker', 'Team 1', 'Price 1', 'Team 2', 'Price 2', 'Draw Price'],
    ];

    for (const market of marketEntities) {
      const homeTeamOdd = market.outcomes.find((outcome) => outcome.name === market.event.homeTeam);
      const awayTeamOdd = market.outcomes.find((outcome) => outcome.name === market.event.awayTeam);
      const drawOdd = market.outcomes.find((outcome) => outcome.name === 'Draw');

      const row: SheetRow = {
        event_name: `${market.event.homeTeam} vs ${market.event.awayTeam}`,
        event_comment_time: market.event.commenceTime.toLocaleString(),
        bookmaker: market.bookmaker.name,
        odd_1_team: homeTeamOdd ? homeTeamOdd.name : 'N/A',
        odd_2_team: awayTeamOdd ? awayTeamOdd.name : 'N/A',
        odd_1_price: homeTeamOdd ? homeTeamOdd.price.toString() : 'N/A',
        odd_2_price: awayTeamOdd ? awayTeamOdd.price.toString() : 'N/A',
        odd_draw_price: drawOdd ? drawOdd.price.toString() : 'N/A',
      };
      sheetValues.push([
        row.event_name,
        row.event_comment_time,
        row.bookmaker,
        row.odd_1_team,
        row.odd_2_team,
        row.odd_1_price,
        row.odd_2_price,
        row.odd_draw_price,
      ]);
    }

    return {
      values: sheetValues,
      range: this.getSheetRange(sheetValues),
    };
  }

  getSheetRange(values: string[][]): string {
    if (values.length === 0) return '';

    const endRow = values.length;
    const endCol = String.fromCharCode(64 + values[0].length);

    return `${this.googleSheetName}!A1:${endCol}${endRow}`;
  }
}
