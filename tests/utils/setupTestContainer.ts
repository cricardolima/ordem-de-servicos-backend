import { Container } from "inversify";
import { ContainerApp } from "../../src/container/inversify.config";
import { TYPES } from "../../src/container/types";

type ContainerConfig = {
    [K in keyof typeof TYPES]?: any;
};

export const setupTestContainer = (config: ContainerConfig = {}): Container => {
    const container = new ContainerApp().init();
    
    // Aplicar configurações personalizadas
    Object.entries(config).forEach(([typeKey, implementation]) => {
        const typeSymbol = TYPES[typeKey as keyof typeof TYPES];
        container.unbind(typeSymbol);
        container.bind(typeSymbol).toConstantValue(implementation);
    });
    
    return container;
}