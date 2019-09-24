import { Injectable, Scope, Inject, ForbiddenException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
/* eslint-disable-next-line */
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class ActionLogger<T = any> {
  oldValue: string;
  newValue: string;

  constructor(@Inject(REQUEST) request: Request) {
    if (!request.user) throw new ForbiddenException();
  }

  before(entity: T): any {
    this.oldValue = JSON.stringify(entity);
  }

  after(entity: T): any {
    this.newValue = JSON.stringify(entity);
  }

  run(action: string): any {
    const { oldValue, newValue } = this;
    const obj = {
      id: '5',
      action,
      oldValue,
      newValue,
    };
  }
}
