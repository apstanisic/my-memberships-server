import { Injectable } from '@nestjs/common';

function allowReadPolicy(bucketName: string): string {
  return JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'AllowPublicRead',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
    ],
  });
}

@Injectable()
export class AppService {
  homePage(): string {
    return 'My Subscriptions Api Home Page';
  }
}
