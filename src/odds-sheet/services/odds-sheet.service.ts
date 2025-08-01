import { Injectable } from '@nestjs/common';
import { OddsSheetAuthService } from './odds-sheet-auth.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class OddsSheetService {
  constructor(
    private readonly oddsSheetAuthService: OddsSheetAuthService,
    private readonly configService: ConfigService,
  ) {}

  get googleSheetUrl(): string {
    return this.configService.get<string>('GOOGLE_SHEETS_SHEET_URL')!;
  }

  get googleSheetId(): string {
    return this.configService.get<string>('GOOGLE_SHEETS_SHEET_ID')!;
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
    const googleSheets = this.oddsSheetAuthService.getSheet();
    await googleSheets.spreadsheets.values.update({
      spreadsheetId: this.googleSheetId,
      range: `${this.googleSheetName}!A1:E10`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [
          ['Team', 'Odds', 'Date', 'Time', 'Status'],
          ['Team A', '1.5', '2023-10-01', '15:00', 'Upcoming'],
          ['Team B', '2.0', '2023-10-01', '15:00', 'Upcoming'],
          ['Team C', '1.8', '2023-10-01', '15:00', 'Upcoming'],
          ['Team D', '2.5', '2023-10-01', '15:00', 'Upcoming'],
        ],
      },
    });
  }
}
