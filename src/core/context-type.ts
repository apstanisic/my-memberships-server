import { ArgumentsHost } from '@nestjs/common';

export enum ExecutionContextType {
  GQL,
  HTTP
}

/**
 * Get Execution Context type
 * @see https://github.com/nestjs/nest/issues/1581
 */
export const getContextType = (context: ArgumentsHost) =>
  context.getArgs().length === 4
    ? ExecutionContextType.GQL
    : ExecutionContextType.HTTP;
