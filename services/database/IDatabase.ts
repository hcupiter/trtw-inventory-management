export interface IDatabase {
  beginTransaction(): void;
  commit(): void;
  rollback(): void;
  getInstance(): any;
  resetDatabase(): Promise<boolean>;
}
