import { ConsoleLogger } from '@nestjs/common';

export class ConsoleLogService {
  private readonly consoleLogger = new ConsoleLogger(ConsoleLogService.name, {
    json: true,
    colors: true,
  });

  log(message: string) {
    this.consoleLogger.log(message);
  }

  error(message: string, trace?: unknown) {
    this.consoleLogger.error(message, trace);
  }
}
