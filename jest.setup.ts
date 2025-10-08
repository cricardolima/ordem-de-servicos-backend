import "reflect-metadata";

process.env.JWT_SECRET = 'test-jwt-secret';
process.env.REFRESH_JWT_SECRET = 'test-refresh-jwt-secret';
process.env.ACCESS_TOKEN_EXPIRATION = '5m';
process.env.REFRESH_JWT_EXPIRES_IN = '1d';