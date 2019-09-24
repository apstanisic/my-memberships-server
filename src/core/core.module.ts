import { Module, DynamicModule } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from './config/config.module';
import { AccessControlModule } from './access-control/access-control.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';

/** Available modules */
type AvailableModules = 'Mail' | 'Config' | 'AccessControl' | 'Auth' | 'Log';

/** Params for dynamic module */
interface ForRootParams {
  ignore: AvailableModules[];
}

/** CoreModule with bundled common modules. Every module is global. */
@Module({})
export class CoreModule {
  static forRoot(params?: ForRootParams): DynamicModule {
    const ignore = params ? params.ignore : [];
    const imports = [];
    if (!ignore.includes('Mail')) imports.push(MailModule);
    if (!ignore.includes('AccessControl')) imports.push(AccessControlModule);
    if (!ignore.includes('Auth')) imports.push(AuthModule);
    if (!ignore.includes('Config')) imports.push(ConfigModule);
    if (!ignore.includes('Log')) imports.push(LoggerModule);
    return {
      imports,
      module: CoreModule,
    };
  }
}
