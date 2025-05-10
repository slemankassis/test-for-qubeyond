declare module "pg" {
  export interface PoolConfig {
    user?: string;
    password?: string;
    host?: string;
    port?: number;
    database?: string;
  }

  export class Pool {
    constructor(config?: PoolConfig);
    on(event: string, listener: Function): this;
    query(text: string, params?: any[]): Promise<any>;
    end(): Promise<void>;
  }
}
