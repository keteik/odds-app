import { Module } from '@nestjs/common';
import { ConsoleLogService } from './services/console-log.service';

@Module({
  providers: [ConsoleLogService],
  exports: [ConsoleLogService],
})
export class LogModule {}
