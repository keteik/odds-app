import { Controller, Get } from '@nestjs/common';
import { OddsSyncService } from '../services/odds-sync.service';
import fs from 'fs/promises';
import { OddsApiEvent } from '../types/odds-api.type';

@Controller('odds-sync')
export class OddsSyncController {
  constructor(private readonly oddsSyncService: OddsSyncService) {}

  @Get('')
  async syncOdds() {
    const oddsRawData = await fs.readFile(
      '/home/krzysztof/Desktop/Inne/Projekty/odds-app/the-odds-api/odds-response.json',
      'utf-8',
    );

    return this.oddsSyncService.syncOddsData(
      JSON.parse(oddsRawData) as OddsApiEvent[],
    );
  }
}
