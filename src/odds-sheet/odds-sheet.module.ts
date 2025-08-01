import { Module } from '@nestjs/common';
import { OddsSheetController } from './controller/odds-sheet.controller';
import { OddsSheetService } from './services/odds-sheet.service';
import { OddsSheetAuthService } from './services/odds-sheet-auth.service';

@Module({
  controllers: [OddsSheetController],
  providers: [OddsSheetAuthService, OddsSheetService],
})
export class OddsSheetModule {}
