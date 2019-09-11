import { AuthGuard } from '@nestjs/passport';
import {
  Injectable,
  ExecutionContext,
  NotImplementedException,
} from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): never {
    throw new NotImplementedException();
    // const ctx = GqlExecutionContext.create(context);
    // return ctx.getContext().req;
  }
}
