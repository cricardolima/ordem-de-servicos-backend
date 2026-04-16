# Plano de Migração: Remover `inversify-express-utils`

## Objetivo

Remover `inversify-express-utils` sem alterar a arquitetura principal do projeto, mantendo:

- Express como framework HTTP
- Inversify como container de DI
- Controllers com responsabilidade fina
- Use cases, repositórios, middlewares e tratamento de erro já existentes

Esta etapa existe para destravar uma migração futura de `express@4` para `express@5` e de `inversify@6` para `inversify@8`, porque a versão atual de `inversify-express-utils` está acoplada a `express:^4.21.1` e `inversify:^6.0.3`.

## Resultado Esperado

Ao final desta etapa:

- o projeto não dependerá mais de `inversify-express-utils`
- as rotas serão registradas manualmente com `express.Router()`
- os controllers continuarão usando DI por construtor com `inversify`
- os testes de integração deixarão de depender de casts para acessar `server.build()`
- `yarn lint:check`, `yarn build` e `yarn test` continuarão passando

## Escopo

Arquivos que provavelmente serão alterados:

- `src/app.ts`
- `src/controllers/auth.controller.ts`
- `src/controllers/user.controller.ts`
- `src/controllers/servicesType.controller.ts`
- `src/controllers/professionals.controller.ts`
- `src/controllers/clients.controller.ts`
- novos arquivos em `src/routes`
- `tests/integration/*.test.ts`
- `package.json`

Arquivos que idealmente não devem exigir mudanças estruturais:

- `src/use-cases/**`
- `src/respositories/**`
- `src/middlewares/auth.middleware.ts`
- `src/middlewares/validate.middleware.ts`
- `src/middlewares/errorHandler.middleware.ts`
- `src/container/inversify.config.ts`

## Passo a Passo

### 1. Expor um `build()` público no `App`

Objetivo:

- parar de depender internamente de `InversifyExpressServer.build()`
- permitir que testes e inicialização usem a mesma fábrica de app Express

Ações:

- refatorar `src/app.ts` para construir e retornar uma instância de `Express`
- manter `start(port)` usando internamente esse `build()`
- preservar os middlewares globais já existentes:
  - `express.json()`
  - `express.urlencoded()`
  - `cookieParser()`
  - `cors(...)`
  - logger
  - `setupProcessHandlers()`
  - `errorHandlerMiddleware`

Critério de aceite:

- `App.build()` retorna um app funcional
- `App.start()` continua funcionando

### 2. Criar uma camada explícita de rotas

Objetivo:

- substituir o registro automático baseado em decorators por `Router()` explícito

Ações:

- criar uma pasta `src/routes`
- criar um arquivo por domínio:
  - `auth.routes.ts`
  - `users.routes.ts`
  - `servicesType.routes.ts`
  - `professionals.routes.ts`
  - `clients.routes.ts`
- criar um `index.ts` agregando os routers

Cada arquivo deve:

- receber ou resolver o controller via container
- registrar middlewares e handlers na mesma ordem do comportamento atual
- usar `router.METHOD(...)` com handlers async embrulhados de forma segura

Sugestão:

- criar um helper local para handlers async, por exemplo:
  - `asyncHandler(fn)`

Critério de aceite:

- todas as rotas atuais ficam registradas explicitamente
- a ordem de middleware por rota permanece equivalente à atual

### 3. Converter controllers para classes comuns

Objetivo:

- remover decorators do `inversify-express-utils`
- manter DI por construtor

Ações:

- remover imports de:
  - `controller`
  - `httpGet`
  - `httpPost`
  - `httpPatch`
  - `httpDelete`
  - `request`
  - `requestBody`
  - `requestParam`
  - `response`
- remover decorators de classe e método
- manter `@inject(...)` do `inversify`
- padronizar métodos para receber `req: Request` e, quando necessário, `res: Response`

Exemplos de adaptação:

- `@requestParam('id') id: string` vira `req.params.id`
- `@requestBody() body` vira `req.body`
- `@response() res` continua `res`
- `@request() req` continua `req`

Critério de aceite:

- controllers seguem finos e sem lógica de infraestrutura extra
- assinaturas ficam simples e previsíveis

### 4. Registrar controllers no container apenas como classes resolvíveis

Objetivo:

- manter o container como fonte de resolução dos controllers

Ações:

- revisar `src/container/inversify.config.ts`
- manter bindings dos use cases e repositórios como estão
- confirmar que os controllers continuam registrados com `toSelf().inSingletonScope()` ou equivalente já usado no projeto

Critério de aceite:

- cada arquivo de rota consegue resolver seu controller via container

### 5. Integrar routers no bootstrap da aplicação

Objetivo:

- ligar a nova camada de rotas ao app Express

Ações:

- no `App.build()`, registrar os routers após os middlewares globais e antes do `errorHandlerMiddleware`
- preservar o comportamento de CORS, cookies, body parser e logger

Critério de aceite:

- todas as rotas respondem sob os mesmos paths atuais:
  - `/auth`
  - `/users`
  - `/services-type`
  - `/professionals`
  - `/clients`

### 6. Ajustar testes de integração

Objetivo:

- remover o acoplamento frágil com a propriedade privada `server`

Ações:

- trocar o padrão atual:
  - cast de `appInstance` para acessar `server.build()`
- por:
  - `const app = appInstance.build()`

Critério de aceite:

- os testes não precisam mais acessar internals por cast
- os endpoints continuam validados da mesma forma

### 7. Remover dependência do manifesto

Objetivo:

- concluir a remoção da biblioteca do projeto

Ações:

- remover `inversify-express-utils` de `package.json`
- atualizar `yarn.lock`

Critério de aceite:

- o projeto compila e testa sem essa dependência

### 8. Validar a migração completa

Comandos obrigatórios:

- `yarn lint:check`
- `yarn build`
- `yarn test`

Observação:

- se os testes de integração precisarem abrir socket local, execute em ambiente que permita `supertest` bindar o servidor

Critério de aceite:

- todos os comandos passam

## Mapeamento de Rotas Atuais

### Auth

- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh-token`

### Users

- `GET /users/`
- `GET /users/:id`
- `POST /users/`
- `PATCH /users/:id`
- `DELETE /users/:id`

### Services Type

- `GET /services-type/`
- `POST /services-type/`
- `DELETE /services-type/:id`
- `PATCH /services-type/:id`
- `GET /services-type/:id`

### Professionals

- `GET /professionals/:id`
- `GET /professionals/`
- `POST /professionals/`
- `PATCH /professionals/:id`
- `DELETE /professionals/:id`

### Clients

- `GET /clients/:id`
- `POST /clients/`
- `DELETE /clients/:id`

## Riscos Principais

### 1. Ordem de middleware por rota

O comportamento atual depende da ordem declarada nos decorators. Ao migrar para routers explícitos, essa ordem precisa ser reproduzida exatamente.

### 2. Erros assíncronos em handlers

Com Express puro, handlers async precisam encaminhar erro corretamente para o middleware global de erro.

### 3. Diferenças sutis de resposta

Alguns métodos retornam objeto diretamente, outros usam `res.status(...).json(...)`. A migração deve preservar o contrato HTTP atual.

### 4. Tipagem de `req.session`

Os controllers que dependem de autenticação continuam esperando `req.session.userId` e `req.session.role`. Isso não pode ser perdido na troca.

## Ordem Recomendada de Implementação

1. Criar `App.build()` público.
2. Criar `src/routes` com um domínio piloto.
3. Migrar primeiro `AuthController`, porque tem menos rotas e cobre cookies, validação e resposta.
4. Validar `lint`, `build` e testes.
5. Migrar `UserController`.
6. Migrar `ServicesTypeController`, `ProfessionalsController` e `ClientsController`.
7. Remover `inversify-express-utils`.
8. Rodar validação final completa.

## Definição de Pronto

A etapa estará concluída quando:

- nenhum arquivo importar `inversify-express-utils`
- nenhum controller usar decorators HTTP dessa biblioteca
- `App` construir o Express manualmente
- os testes de integração usarem `App.build()`
- a dependência sair do `package.json`
- `yarn lint:check`, `yarn build` e `yarn test` passarem
