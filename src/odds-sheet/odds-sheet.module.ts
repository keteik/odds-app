import { Module } from '@nestjs/common';
import { OddsSheetController } from './controller/odds-sheet.controller';
import { OddsSheetService } from './services/odds-sheet.service';
import { OddsSheetAuthService } from './services/odds-sheet-auth.service';
import { DbModule } from '../db/db.module';
import { OddsSheetMapperService } from './services/odds-sheet-mapper.service';

@Module({
  imports: [DbModule],
  controllers: [OddsSheetController],
  providers: [OddsSheetAuthService, OddsSheetService, OddsSheetMapperService],
  exports: [OddsSheetService],
})
export class OddsSheetModule {}
