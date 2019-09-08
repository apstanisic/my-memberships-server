import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor() {
    try {
      const file = fs.readFileSync('.env');
      dotenv.config();
      this.envConfig = dotenv.parse(file);
    } catch (error) {
      throw new InternalServerErrorException('No .env file found');
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
