import { Controller, Get, Req } from '@nestjs/common';
import { OddsSheetService } from '../services/odds-sheet.service';
import express from 'express';

@Controller('sheets')
export class OddsSheetController {
  constructor(private readonly oddsSheetService: OddsSheetService) {}

  @Get('odds')
  showOddsSheet(@Req() req: express.Request) {
    return this.oddsSheetService.showOddsSheet(req);
  }
}
