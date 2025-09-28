import "reflect-metadata";
import express from "express";
import { InversifyExpressServer } from "inversify-express-utils";
import { ContainerApp } from "@container/inversify.config";
import { Container } from "inversify";
import cors from "cors";
import { errorHandlerMiddleware } from "@middleware/errorHandler.middleware";
import logger from "@utils/logger";
import { setupProcessHandlers } from "@utils/processHandlers";

export class App {
    private server: InversifyExpressServer;
    private container: Container;

    constructor() {
        this.container = new ContainerApp().init();
        this.server = new InversifyExpressServer(this.container);
        this.setupMiddleware();
    }

    private setupMiddleware(): void {
        this.server.setConfig((app) => {
            // Middleware para parsing de JSON
            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));
            
            // Middleware para CORS
            app.use(cors({
                origin: process.env.CORS_ORIGIN || "*",
                methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
                allowedHeaders: ["Content-Type", "Authorization"]
            }));

            // Middleware para logging básico
            app.use((req, res, next) => {
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
            logger.info(`📊 Ambiente: ${process.env.NODE_ENV || "development"}`);
        });
    }

    public getContainer(): Container {
        return this.container;
    }
}