import { createParamDecorator } from '@nestjs/common';

/**
 * Get currently logged user in from request
 * Usage:
 * someMethod(@GetUser() user: User) {}
 */
export const GetUser = createParamDecorator((data: string, req) => {
  return data ? req.user && req.user[data] : req.user;
});
