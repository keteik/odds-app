import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { EnvSchema } from '../../config/env.config';

@Injectable()
export class OddsSheetAuthService {
  private oauth2Client: OAuth2Client;

  constructor(private readonly configService: ConfigService<EnvSchema, true>) {
    this.oauth2Client = new google.auth.OAuth2({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });

    this.oauth2Client.setCredentials({
      access_token: this.configService.get('GOOGLE_SHEETS_ACCESS_TOKEN'),
      refresh_token: this.configService.get('GOOGLE_SHEETS_REFRESH_TOKEN'),
    });
  }

  get clientId() {
    return this.configService.get('GOOGLE_SHEETS_CLIENT_ID', { infer: true });
  }

  get clientSecret() {
    return this.configService.get('GOOGLE_SHEETS_CLIENT_SECRET', { infer: true });
  }

  getSheet() {
    return google.sheets({
      version: 'v4',
      auth: this.oauth2Client,
    });
  }
}
