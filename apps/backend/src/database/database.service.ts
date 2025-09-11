import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  public db: NodePgDatabase<typeof schema>;
  private pool: Pool;

  private readonly logger = new Logger(DatabaseService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const dbConfig = this.configService.get<{
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
    }>('database');

    this.pool = new Pool({
      host: dbConfig?.host,
      port: dbConfig?.port,
      user: dbConfig?.username,
      password: dbConfig?.password,
      database: dbConfig?.database,
    });

    this.db = drizzle(this.pool, { schema });

    try {
      await this.pool.connect();
      this.logger.debug('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Database connection failed:', error);
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
