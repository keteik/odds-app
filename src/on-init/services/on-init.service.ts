import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { OddsSyncService } from '../../odds-sync/services/odds-sync.service';

@Injectable()
export class OnInitService implements OnApplicationBootstrap {
  constructor(private readonly oddsSyncService: OddsSyncService) {}

  async onApplicationBootstrap() {
    await this.oddsSyncService.syncOddsData();
  }
}
