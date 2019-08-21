import { createParamDecorator } from '@nestjs/common';

/* Get currently logged user */
export const GetUser = createParamDecorator((data: string, req) => {
  return data ? req.user && req.user[data] : req.user;
});
