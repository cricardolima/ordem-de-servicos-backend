import 'reflect-metadata';
import { ContainerApp } from '@container/inversify.config';
import { errorHandlerMiddleware } from '@middleware/errorHandler.middleware';
import logger from '@utils/logger';
import { setupProcessHandlers } from '@utils/processHandlers';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import type { Container } from 'inversify';
import { registerRoutes } from './routes';

export class App {
  private readonly container: Container;
  private app?: Express;

  constructor(container?: Container) {
    this.container = container || new ContainerApp().init();
    setupProcessHandlers();
  }

  private setupMiddleware(app: Express): void {
    // Middleware para parsing de JSON
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Middleware para CORS
    app.use(
      cors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    );

    // Middleware para logging básico
    app.use((req, _, next) => {
      logger.info(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  public build(): Express {
    if (this.app) {
      return this.app;
    }

    const app = express();

    this.setupMiddleware(app);
    app.use(registerRoutes(this.container));
    app.use(errorHandlerMiddleware);

    this.app = app;
    return app;
  }

  public start(port: number = 3000): void {
    const app = this.build();

    app.listen(port, () => {
      logger.info(`🚀 Servidor rodando na porta ${port}`);
      logger.info(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  }

  public getContainer(): Container {
    return this.container;
  }
}
