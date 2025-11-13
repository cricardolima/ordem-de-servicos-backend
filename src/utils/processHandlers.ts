import logger from '@utils/logger';

export const setupProcessHandlers = () => {
  process.on('uncaughtException', (err: Error) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (err: Error) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT signal received. Shutting down gracefully.');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received. Shutting down gracefully.');
    process.exit(0);
  });
};
