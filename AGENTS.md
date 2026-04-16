# AGENTS.md

## Propósito

Este documento orienta o Codex sobre como operar neste repositório. O objetivo é reduzir ambiguidade, evitar mudanças desalinhadas com a base existente e garantir que toda alteração seja pequena, coerente e validada.

O projeto é um backend Node.js em TypeScript com arquitetura em camadas, uso de Inversify para DI, Prisma para persistência, Zod para validação e Jest/Supertest para testes. O Codex deve trabalhar respeitando essa estrutura, em vez de introduzir padrões paralelos.

## Como o Codex Deve Trabalhar

- Leia primeiro os arquivos relacionados ao fluxo afetado antes de editar.
- Faça mudanças locais e intencionais. Evite refactors amplos sem pedido explícito.
- Siga os padrões já presentes no código, mesmo quando houver pequenas inconsistências históricas.
- Ao alterar um comportamento, revise também contratos, validações, bindings, testes e efeitos colaterais próximos.
- Não assuma bibliotecas, convenções ou scripts que não existam no repositório.
- Antes de encerrar, valide o que mudou com os comandos apropriados.

## Commands

Use sempre os scripts oficiais do projeto:

- Desenvolvimento: `yarn dev`
- Build: `yarn build`
- Testes: `yarn test`
- Testes em watch: `yarn test:watch`
- Cobertura: `yarn test:coverage`
- Lint e análise: `yarn lint:check`
- Lint com correção: `yarn lint:fix`
- Formatação: `yarn lint:format`

## Política de Verificação

O Codex deve usar os comandos acima para verificar o próprio trabalho.

- Após qualquer mudança de código, rode pelo menos `yarn lint:check` e `yarn test`.
- Se a alteração tocar tipagem, aliases, container DI, controllers, middlewares, use cases, repositórios ou contratos compartilhados, rode também `yarn build`.
- Se uma mudança impactar regras de entrada, autenticação ou respostas HTTP, priorize testes relacionados ao fluxo afetado e depois a suíte completa.
- Não finalize a tarefa dizendo que está concluída sem relatar quais comandos foram executados e o resultado.

## Stack Principal

Tecnologias e versões relevantes identificadas no repositório:

- TypeScript `^5.9.2`
- Node.js com saída CommonJS
- Express `^4.21.2`
- Inversify `^6.2.2`
- inversify-express-utils `^6.5.0`
- Prisma e `@prisma/client` `6.16.2`
- PostgreSQL como banco principal
- Zod `^4.1.11`
- Jest `29`
- ts-jest `^29.4.4`
- Supertest `^7.1.4`
- Biome `2.3.5`
- Winston `^3.17.0`
- bcrypt `^6.0.0`
- jsonwebtoken `^9.0.2`
- tsx `^4.20.5`

## Configuração Técnica Relevante

O Codex deve considerar estas decisões já existentes:

- TypeScript com `strict: true`
- `exactOptionalPropertyTypes` habilitado
- `noUncheckedIndexedAccess` habilitado
- `target` = `es2022`
- `module` = `commonjs`
- Decorators habilitados com `experimentalDecorators` e `emitDecoratorMetadata`
- Path aliases ativos para módulos internos

Aliases configurados:

- `@lib/*`
- `@use-cases/*`
- `@container/*`
- `@repositories/*`
- `@utils/*`
- `@dtos/*`
- `@controllers/*`
- `@exceptions/*`
- `@middleware/*`
- `@validators/*`
- `@tests/*`

## Estrutura do Projeto

O projeto está organizado por responsabilidade. O Codex deve manter essa separação.

- `src/index.ts`
  Ponto de entrada da aplicação.

- `src/app.ts`
  Bootstrap do Express, configuração do servidor Inversify, middlewares globais e tratamento de erro.

- `src/controllers`
  Controllers HTTP com decorators do `inversify-express-utils`. Devem orquestrar request/response e delegar regra de negócio para use cases.

- `src/use-cases`
  Casos de uso por domínio. Aqui fica a regra de negócio principal. Cada caso de uso tende a ter pasta própria com interface, implementação, testes e `index.ts`.

- `src/respositories`
  Camada de persistência e contratos de acesso a dados. Observação importante: o diretório está nomeado como `respositories` no projeto atual; preserve esse nome até existir refactor explícito.

- `src/container`
  Símbolos e bindings do Inversify. Toda nova implementação injetável precisa ser refletida aqui quando aplicável.

- `src/middlewares`
  Middlewares de autenticação, autorização, validação e tratamento de erros.

- `src/validators`
  Schemas Zod e testes de validação. Mudanças em payloads de entrada devem passar por aqui.

- `src/dtos`
  Tipos e contratos compartilhados entre camadas.

- `src/lib`
  Instâncias e integrações de baixo nível, como Prisma.

- `src/utils`
  Utilitários transversais, como logger, hash, verificação de senha e process handlers.

- `src/exceptions`
  Exceções de domínio e exceções HTTP padronizadas.

- `tests/integration`
  Testes de integração orientados a fluxo HTTP.

- `tests/repositories`
  Repositórios em memória e doubles para testes.

- `tests/utils`
  Helpers de teste, como setup de container.

- `prisma/schema.prisma`
  Fonte de verdade do modelo de dados.

- `prisma/migrations`
  Histórico de migrations.

- `prisma/seed.ts`
  Seed do banco.

## Convenções de Código

As convenções abaixo foram inferidas do código existente e devem ser mantidas.

- Use TypeScript estrito. Não enfraqueça tipos sem necessidade concreta.
- Prefira `async/await` em vez de encadeamento manual de `Promise`.
- Mantenha assinaturas explícitas em métodos públicos, especialmente em use cases e repositórios.
- Prefira reutilizar interfaces e tipos existentes em `src/dtos` e nos contratos de cada módulo.
- Use imports com aliases configurados em vez de caminhos relativos longos.
- Mantenha indentação de `2` espaços.
- Use aspas simples.
- Respeite o formato do Biome, incluindo largura de linha de até `120`.
- Siga o padrão atual de classes com DI por construtor usando `@inject`.
- Em controllers, mantenha o papel fino: receber request, validar, chamar use case e retornar resposta.
- Em use cases, concentre a regra de negócio e não mova lógica para controllers.
- Em repositórios, mantenha foco em persistência e consultas.
- Em validações, use Zod em `src/validators`.
- Em exceções, reutilize as classes existentes antes de criar novos formatos de erro.

## Convenções de Nomenclatura

- Classes: `PascalCase`
- Funções e variáveis: `camelCase`
- Interfaces: prefixo `I` quando o módulo já segue esse padrão
- Pastas de use cases: `PascalCase`
- Controllers: `*.controller.ts`
- Schemas: `*.schema.ts`
- Use cases: `*.use-case.ts`
- Contratos/interfaces de use case: `*.interface.ts`
- Testes: `*.test.ts`

Não renomeie arquivos, pastas ou símbolos apenas para “corrigir estilo” sem pedido explícito.

## Fluxo de Mudança por Área

Quando editar uma parte do sistema, o Codex deve revisar os pontos adjacentes:

- Ao alterar controller:
  revise middleware, schema Zod, DTOs, use case associado e testes de integração.

- Ao alterar use case:
  revise interface, bindings do container, repositório usado, exceções e testes unitários/integrados.

- Ao alterar repositório:
  revise contrato da interface, chamadas do use case, modelo Prisma e testes.

- Ao alterar schema de validação:
  revise payloads aceitos pelo endpoint e testes dos validators.

- Ao alterar tipos compartilhados:
  revise todos os consumidores diretos antes de concluir.

- Ao alterar Prisma:
  revise `schema.prisma`, migration, repositórios afetados, DTOs, testes e possíveis seeds.

## Banco e Ambiente

- O banco principal é PostgreSQL, acessado via Prisma e `DATABASE_URL`.
- Existe um `docker-compose.yaml` com serviço local `db`.
- O projeto usa migrations versionadas em `prisma/migrations`.
- Alterações em modelo de dados devem ser feitas de forma explícita e rastreável.

Se o trabalho exigir mudança no banco:

- atualize `prisma/schema.prisma`
- gere a migration correspondente
- revise impacto em queries Prisma
- revise impacto em DTOs, use cases, controllers e testes

## Boundaries

O Codex nunca deve:

- modificar arquivos `.env`, segredos ou credenciais
- executar deploy, publish, release ou rotinas de produção sem permissão explícita
- alterar CI/CD, infraestrutura, Docker, banco ou migrations sem necessidade real e sem validar impacto
- remover testes, validações ou tratamento de erro para “fazer passar”
- introduzir nova dependência se a stack atual já cobre o problema
- usar `any`, `@ts-ignore` ou casts excessivos como atalho
- sobrescrever mudanças já existentes do usuário no workspace
- fazer refactors amplos, renomeações em massa ou reorganizações estruturais sem pedido explícito

## Expectativa de Resposta Final do Codex

Ao concluir uma tarefa, o Codex deve informar de forma objetiva:

- o que foi alterado
- quais arquivos principais foram tocados
- quais comandos de validação foram executados
- se existe alguma limitação, risco ou ponto não validado

Se não foi possível rodar testes, build ou lint, isso deve ser dito explicitamente.
