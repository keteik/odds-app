import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class OddsSheetAuthService {
  private oauth2Client: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });

    this.oauth2Client.setCredentials({
      access_token: this.configService.get<string>('GOOGLE_SHEETS_ACCESS_TOKEN'),
      refresh_token: this.configService.get<string>('GOOGLE_SHEETS_REFRESH_TOKEN'),
    });
  }

  get clientId(): string {
    return this.configService.get<string>('GOOGLE_SHEETS_CLIENT_ID')!;
  }

  get clientSecret(): string {
    return this.configService.get<string>('GOOGLE_SHEETS_CLIENT_SECRET')!;
  }

  get redirectUri(): string {
    return this.configService.get<string>('GOOGLE_SHEETS_REDIRECT_URI')!;
  }

  getSheet() {
    return google.sheets({
      version: 'v4',
      auth: this.oauth2Client,
    });
  }
}
