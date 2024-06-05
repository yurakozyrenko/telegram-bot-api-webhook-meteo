import { ValueTransformer } from 'typeorm';

export const bigintTransformer: ValueTransformer = {
  to: (entityValue: number) => entityValue as unknown as bigint,
  from: (databaseValue: string): number => {
    return parseInt(databaseValue, 10) as number;
  },
};
