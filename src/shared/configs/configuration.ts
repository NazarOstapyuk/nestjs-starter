export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.PORT,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  refreshToken: {
    secret: process.env.REFRESH_SECRET,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },
});
