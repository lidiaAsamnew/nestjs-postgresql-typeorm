import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'Lidu@@123',
    database: process.env.DB_NAME ?? 'nestjs_typeorm',
    autoLoadEntities: true,
    synchronize: (process.env.DB_SYNC ?? 'true') === 'true',
    logging: (process.env.DB_LOGGING ?? 'false') === 'true',
  }),
);

