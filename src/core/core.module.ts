import { Module, DynamicModule } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from './config/config.module';
import { AccessControlModule } from './access-control/access-control.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { StorageModule } from './storage/storage.module';

/** Available modules */
type AvailableModules =
  | 'Mail'
  | 'Config'
  | 'AccessControl'
  | 'Auth'
  | 'Log'
  | 'Storage';

/** Params for dynamic module */
interface ForRootParams {
  ignore: AvailableModules[];
}

/** CoreModule with bundled common modules. Every module is global. */
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

    return {
      imports,
      module: CoreModule,
    };
  }
}
