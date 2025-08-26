import { Module } from '@nestjs/common';
import { OddsSheetController } from './controller/odds-sheet.controller';
import { OddsSheetService } from './services/odds-sheet.service';
import { OddsSheetAuthService } from './services/odds-sheet-auth.service';
import { DbModule } from '../db/db.module';
import { OddsSheetMapperService } from './services/odds-sheet-mapper.service';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [DbModule, LogModule],
  controllers: [OddsSheetController],
  providers: [OddsSheetAuthService, OddsSheetService, OddsSheetMapperService],
  exports: [OddsSheetService],
})
export class OddsSheetModule {}
