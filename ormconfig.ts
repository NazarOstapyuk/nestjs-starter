module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  entities: [__dirname + '/src/../**/*.entity{.ts,.js}'],
  synchronize: false,
  seeds: [__dirname + '/src/seeds/**/*{.ts,.js}'],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: __dirname + '/src/migrations',
  },
  // ssl: true,
  // extra: {
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
  // },
};
