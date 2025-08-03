import { Injectable } from '@nestjs/common';
import { OddsSheetAuthService } from './odds-sheet-auth.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { EnvSchema } from '../../config/env.config';
import { MarketRepositoryService } from '../../db/providers/market.repository.service';
import { OddsSheetMapperService } from './odds-sheet-mapper.service';

@Injectable()
export class OddsSheetService {
  constructor(
    private readonly oddsSheetAuthService: OddsSheetAuthService,
    private readonly configService: ConfigService<EnvSchema>,
    private readonly marketRepositoryService: MarketRepositoryService,
    private readonly oddsSheetMapperService: OddsSheetMapperService,
  ) {}

  get googleSheetUrl(): string {
    return this.configService.get<string>('GOOGLE_SHEETS_SHEET_URL')!;
  }

  get googleSheetId(): string {
    return this.configService.get<string>('GOOGLE_SHEETS_SHEET_ID')!;
  }

  get sportKey(): string {
    return this.configService.get<string>('THE_ODDS_API_SPORT_KEY')!;
  }

  get googleSheetName(): string {
    return this.configService.get<string>('GOOGLE_SHEETS_SHEET_NAME')!;
  }

  // Redirects to the Google Sheets URL with the specified sheet ID
  showOddsSheet(req: Request) {
    try {
      const redirectUrl = `${this.googleSheetUrl}${this.googleSheetId}`;

      return req.res?.redirect(redirectUrl);
    } catch (error) {
      console.error('Error reading sheet:', error);
    }
  }

  // Sync Google Sheets with odds data
  async syncOddsSheet(): Promise<void> {
    try {
      // Find all markets by sport key
      const markets = await this.marketRepositoryService.findAllBySportKey(this.sportKey);

      // Map the market entities to sheet data
      const sheetData = this.oddsSheetMapperService.mapEntitiesToSheetData(markets);

      // Sync the sheet data to Google Sheets
      const googleSheets = this.oddsSheetAuthService.getSheet();
      await googleSheets.spreadsheets.values.clear({
        spreadsheetId: this.googleSheetId,
        range: this.googleSheetName,
      });
      await googleSheets.spreadsheets.values.update({
        spreadsheetId: this.googleSheetId,
        range: sheetData.range,
        valueInputOption: 'RAW',
        requestBody: {
          values: sheetData.values,
        },
      });
    } catch (error) {
      console.error('Error syncing odds sheet:', error);
    }
  }
}
