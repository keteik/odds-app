import { uuidv7 } from 'uuidv7';

export const getPrimaryKey = (): string => {
  return uuidv7();
};
