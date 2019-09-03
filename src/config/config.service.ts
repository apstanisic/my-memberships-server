import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { InternalError } from '../core/custom-exceptions';

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor() {
    try {
      const file = fs.readFileSync('.env');
      dotenv.config();
      this.envConfig = dotenv.parse(file);
    } catch (error) {
      throw new InternalError('No .env file found');
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
