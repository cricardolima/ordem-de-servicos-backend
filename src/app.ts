import 'reflect-metadata';
import { ContainerApp } from '@container/inversify.config';
import { errorHandlerMiddleware } from '@middleware/errorHandler.middleware';
import logger from '@utils/logger';
import { setupProcessHandlers } from '@utils/processHandlers';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import type { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

export class App {
  private readonly server: InversifyExpressServer;
  private readonly container: Container;

  constructor(container?: Container) {
    this.container = container || new ContainerApp().init();
    this.server = new InversifyExpressServer(this.container);
    this.setupMiddleware();
  }

  private setupMiddleware(): void {
    this.server.setConfig((app) => {
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

      // Middleware para process handlers
      setupProcessHandlers();
    });

    this.server.setErrorConfig((app) => {
      // Middleware de tratamento de erros
      app.use(errorHandlerMiddleware);
    });
  }

  public start(port: number = 3000): void {
    const app = this.server.build();

    app.listen(port, () => {
      logger.info(`🚀 Servidor rodando na porta ${port}`);
      logger.info(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  }

  public getContainer(): Container {
    return this.container;
  }
}
