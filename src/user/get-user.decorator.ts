import { createParamDecorator } from '@nestjs/common';

/**
 * Get logged user from request
 * @example
 *  someMethod(@GetUser() user: User) {}
 */
export const GetUser = createParamDecorator((data: string, req) => req.user);

/**
 * Get logged user in GqlResolver
 * @example
 *  someMethod(@GqlUser() user: User) {}
 */
export const GqlUser = createParamDecorator(
  (data, [root, args, ctx, info]) => ctx.req.user,
);
