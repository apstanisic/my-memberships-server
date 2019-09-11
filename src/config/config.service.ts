import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import {
  Injectable,
  InternalServerErrorException,
  Optional,
  Logger,
} from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  private logger = new Logger();

  constructor(@Optional() fileName?: string) {
    try {
      const file = readFileSync(fileName || '.env');
      this.envConfig = dotenv.parse(file);
    } catch (error) {
      this.logger.error('No file for config found.');
      throw new InternalServerErrorException();
    }
  }

  /** Get specified value from config */
  get(key: string): string | undefined {
    return this.envConfig[key];
  }

  /** Get all values from config */
  getAll(): Record<string, any> {
    return this.envConfig;
  }
}
