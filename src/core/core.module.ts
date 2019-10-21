import { Module, DynamicModule } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from './config/config.module';
import { AccessControlModule } from './access-control/access-control.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { StorageModule } from './storage/storage.module';
import { CronModule } from './cron/cron.module';
import { NotificationModule } from './notification/notification.module';

/** Available modules */
type AvailableModules =
  | 'Mail'
  | 'Config'
  | 'AccessControl'
  | 'Auth'
  | 'Log'
  | 'Storage'
  | 'Notification'
  | 'Cron';

/** Params for dynamic module */
interface ForRootParams {
  ignore: AvailableModules[];
}

/**
 * CoreModule with bundled common modules.
 * Every module is global, so if you only need 1 or 2 modules,
 * just import them manually.
 */
@Module({})
export class CoreModule {
  static forRoot(params?: ForRootParams): DynamicModule {
    const imports = [];
    const ignore = params ? params.ignore : [];
    // Shorthand for checking if module should be included
    const shouldInclude = (module: AvailableModules): boolean =>
      !ignore.includes(module);

    if (shouldInclude('Mail')) imports.push(MailModule);
    if (shouldInclude('AccessControl')) imports.push(AccessControlModule);
    if (shouldInclude('Auth')) imports.push(AuthModule);
    if (shouldInclude('Config')) imports.push(ConfigModule);
    if (shouldInclude('Log')) imports.push(LoggerModule);
    if (shouldInclude('Storage')) imports.push(StorageModule);
    if (shouldInclude('Cron')) imports.push(CronModule);
    if (shouldInclude('Notification')) imports.push(NotificationModule);

    return {
      imports,
      module: CoreModule,
    };
  }
}
