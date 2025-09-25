import "reflect-metadata";
import express from "express";
import { InversifyExpressServer } from "inversify-express-utils";
import { ContainerApp } from "@container/inversify.config";
import { Container } from "inversify";
import cors from "cors";

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
                console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
                next();
            });
        });

        this.server.setErrorConfig((app) => {
            // Middleware de tratamento de erros
            app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                console.error(err.stack);
                res.status(500).json({
                    error: "Erro interno do servidor",
                    message: process.env.NODE_ENV === "development" ? err.message : "Algo deu errado"
                });
            });
        });
    }

    public start(port: number = 3000): void {
        const app = this.server.build();
        
        app.listen(port, () => {
            console.log(`🚀 Servidor rodando na porta ${port}`);
            console.log(`📊 Ambiente: ${process.env.NODE_ENV || "development"}`);
        });
    }

    public getContainer(): Container {
        return this.container;
    }
}