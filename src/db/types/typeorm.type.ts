export type UpsertData<T> = {
  entities: T[];
  overwrite: string[];
  conflictTarget: string[];
  returning: string[];
};
