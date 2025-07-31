import { HttpService } from '@nestjs/axios';
import { TheOddsApiEvent } from '../types/odds-api.type';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TheOddsApiService {
  private readonly RETRY_COUNT = 3;
  private readonly RETRY_DELAY = 5000; // milliseconds

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  get baseUrl(): string {
    return this.configService.get<string>('THE_ODDS_API_BASE_URL')!;
  }

  get apiKey(): string {
    return this.configService.get<string>('THE_ODDS_API_KEY')!;
  }

  async fetchEvents(sportKey: string, regions: string[]): Promise<TheOddsApiEvent[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<TheOddsApiEvent[]>(`${this.baseUrl}sports/${sportKey}/odds`, {
          params: {
            apiKey: this.apiKey,
            regions: regions.join(','),
          },
        })
        .pipe(
          retry({ count: this.RETRY_COUNT, delay: this.RETRY_DELAY }),
          catchError((error) => {
            throw error;
          }),
        ),
    );

    return data || [];
  }
}
