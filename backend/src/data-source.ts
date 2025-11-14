import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'cricauc',
  password:
    process.env.DB_PASSWORD ||
    (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('DB_PASSWORD environment variable is required in production');
      }
      return 'cricauc_password'; // Only allow default in development
    })(),
  database: process.env.DB_NAME || 'cricauc_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
};

export const dataSource = new DataSource(dataSourceOptions);
