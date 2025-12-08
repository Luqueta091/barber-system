# Conclusão das tarefas do codex_tasks

## TASK-BIZ-001 – Understand business problem
- Problema: barbeiros/autônomos perdem tempo e receita porque o agendamento é manual (WhatsApp/ligação), sem agenda centralizada, controle de faltas ou bloqueio de reincidentes.
- Usuários: barbeiros de pequenas barbearias (1–3 profissionais) e clientes que precisam marcar horário.
- Dor atual: necessidade de parar o atendimento para responder, checar disponibilidade de cabeça ou em cadernos, agendas com buracos e no-shows sem controle, perda de mensagens e demora na resposta.

## TASK-BIZ-002 – Understand V1 scope
- **Goal:** permitir que o cliente agende sozinho e o barbeiro visualize/controle agenda com gestão básica de faltas e bloqueio.
- **In Scope:** cadastro de barbeiro, serviço (nome, duração, preço, ativo), cliente (telefone, faltas, bloqueio), horários de trabalho por barbeiro, cálculo de slots conforme serviço/agenda, tela de agendamento do cliente (escolher barbeiro/serviço/dia/slot), criação/cancelamento/reagendamento, agenda do barbeiro com mudança de status, regras de faltas/bloqueio, comunicação básica (confirmação/cancelamento), integrações básicas (Maps/WhatsApp), responsividade simples.
- **Out of Scope:** pagamentos online, login/segurança avançada, notificações push complexas, múltiplas unidades/franquias, programas de fidelidade, marketing, relatórios avançados.
- **V1 Ready Criteria:** cliente consegue criar/cancelar agendamento dentro das regras; barbeiro vê agenda diária, muda status (CONFIRMADO, CANCELADO_CLIENTE/BARBEIRO, CONCLUIDO, FALTA); faltas acumulam e bloqueiam cliente; serviços/horários configuráveis.

## TASK-BIZ-003 – Understand entities
- **BARBEIRO:** id, nome, telefone, ativo, corAgenda; relações com HORARIO_TRABALHO e AGENDAMENTO.
- **CLIENTE:** id, nome, telefone, faltas, bloqueado, ativo; relaciona-se com AGENDAMENTO.
- **SERVICO:** id, nome, duração, preço, ativo; relaciona-se com AGENDAMENTO.
- **HORARIO_TRABALHO:** id, barbeiroId, diaSemana, horaInicio, horaFim; pertence a BARBEIRO.
- **AGENDAMENTO:** id, barbeiroId, clienteId, servicoId, dataHoraInicio/fim, status, origem, observacoes; relaciona BARBEIRO, CLIENTE e SERVICO.

## TASK-BIZ-004 – Understand appointment lifecycle
- Estados: PENDENTE/CONFIRMADO, CANCELADO_CLIENTE, CANCELADO_BARBEIRO, CONCLUIDO, FALTA.
- Transições: cliente cria (CONFIRMADO), cliente pode cancelar/reagendar antes do limite; barbeiro pode cancelar ou marcar CONCLUIDO/FALTA após horário; no-show marca FALTA e incrementa contador do cliente.
- Regras temporais: lead time mínimo para agendar; janela de cancelamento antes do início; disponibilidade baseada em horários de trabalho, duração do serviço e conflitos existentes.
- Ação em falta: status vira FALTA e cliente acumula faltas; ao atingir limite, cliente é bloqueado para novos agendamentos.

## TASK-ARC-001 – Approve architecture
- Módulos: clientes, barbeiros, servicos, agendamentos, shared.
- Camadas: interface (HTTP/API), domain (entidades/regras/use-cases), infra (prisma/repos/logging).
- Shared provê infraestrutura comum (database, logger, tipos utilitários, utils de data/validação).
- Cada módulo mantém entidades e contratos de repositório, com mappers e implementações Prisma na camada infra.
- Rotas HTTP expõem casos de uso e validam entrada com Zod.
- Agendamentos depende de clientes/barbeiros/servicos para validar disponibilidade e regras.
- Use cases orquestram regras de lead time, bloqueio por faltas e cálculo de slots.
- Prisma centraliza models e relações (barbeiro/cliente/serviço/horário/agendamento).
- Logger simples para observabilidade.
- Tests: unitários de regras e integração via supertest.
- Open risks: definição detalhada de regras de bloqueio e lead time; autenticação/segurança futura; sincronização de horários e timezone.

## TASK-BE-001 a TASK-BE-005 – Comandos
```
git init
echo "# barbearia-agendamento-backend" > README.md
git add README.md
git commit -m "chore: initial commit"
```
```
npm init -y
npm install --save-dev typescript ts-node-dev ts-node
npx tsc --init --target ES2021 --module commonjs --rootDir src --outDir dist --strict true --esModuleInterop true --moduleResolution node
```
```
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/main/server.ts",
  "build": "tsc",
  "start": "node dist/main/server.js"
}
```
```
npm install express cors dotenv zod
```
```
npm install --save-dev typescript ts-node-dev @types/node @types/express jest ts-jest supertest
```

## TASK-BE-006 – tsconfig.json
Ver arquivo `tsconfig.json` criado no projeto.

## TASK-BE-010/011/012 – app, server e routes
Implementados em `src/main/app.ts`, `src/main/server.ts`, `src/main/routes.ts`.

## TASK-BE-020/021/022 – shared/infra
Estrutura criada em `src/shared/infra/` com `database.ts` e `logger.ts`.

## TASK-BE-030/031 – Prisma comandos
```
npm install prisma @prisma/client
npx prisma init
```

## TASK-BE-032 – .env.example
Arquivo `.env.example` criado com DATABASE_URL e PORT.

## TASK-BE-033 a TASK-BE-038 – Models e relações
Modelos definidos em `prisma/schema.prisma` com relações solicitadas.

## TASK-BE-039 – Migrations command
```
npx prisma migrate dev --name init
```

## TASK-BE-040 – Export Prisma client
Implementado em `src/shared/infra/database.ts` exportando `prisma` singleton.

## TASK-BE-045/046/047 – Tipos
Estrutura `src/shared/types` e arquivos `Result.ts` e `DomainError.ts` criados com definições solicitadas.

## TASK-BE-048/049 – Utils
Pasta `src/shared/utils` criada com `dateUtils.ts` contendo utilitários solicitados.

## TASK-BE-100 – Clientes module tree
```
src/modules/clientes/
├─ interface/
│  ├─ http/
│  └─ dtos/
├─ domain/
│  ├─ entities/
│  ├─ use-cases/
│  ├─ rules/
│  └─ contracts/
└─ infra/
   ├─ repositories/
   └─ mappers/
```

## TASK-BE-101 – Physical folders
Pastas criadas conforme árvore acima.

## TASK-QA-004 – Unit tests CriarAgendamento
Arquivo `tests/unit/CriarAgendamento.spec.ts` criado com casos solicitados usando mocks.

## TASK-QA-005 – Unit tests RegistrarFaltaAgendamento
Arquivo `tests/unit/RegistrarFaltaAgendamento.spec.ts` criado com cenários de falta e bloqueio.

## TASK-QA-010 – API integration tests
Arquivo `tests/integration/apiFlows.spec.ts` criado com fluxo completo usando supertest.

## TASK-QA-011 – Frontend E2E outline
Arquivo abaixo descreve plano de testes Playwright/Cypress:
```ts
// tests/e2e/frontend-booking.spec.ts
describe('Fluxo de agendamento do cliente', () => {
  it('cliente agenda do início ao fim', () => {
    cy.visit('/');
    cy.contains('Escolher barbeiro').click();
    cy.contains('Carlos').click();
    cy.contains('Corte').click();
    cy.contains('Selecionar data').click();
    cy.contains('10:00').click();
    cy.contains('Confirmar agendamento').click();
    cy.contains('Agendamento confirmado');
  });
});

describe('Agenda do barbeiro', () => {
  it('visualiza e atualiza status', () => {
    cy.visit('/agenda');
    cy.contains('Hoje').click();
    cy.contains('Cliente').click();
    cy.contains('Marcar como Concluído').click();
    cy.contains('Status: CONCLUIDO');
  });
});
```

## TASK-OPS-001 – Backend Dockerfile
Dockerfile criado na raiz com build multi-stage.

## TASK-OPS-002 – docker-compose
`docker-compose.yml` criado com serviços backend e Postgres.

## TASK-OPS-003 – .env.example
Inclui DATABASE_URL, PORT, NODE_ENV.

## TASK-OPS-004 – CI workflow
`.github/workflows/ci.yml` criado com etapas de install, test e build.

## TASK-OPS-010 – Frontend build script
Trecho esperado no package.json do frontend:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

## TASK-OPS-011 – Frontend hosting instructions
- Rode `npm run build` para gerar a pasta `dist` da aplicação React.
- Escolha o provedor (Netlify/Vercel/S3) e crie um novo site estático.
- Aponte o diretório de publicação para `dist`.
- Configure a variável de ambiente `VITE_API_URL` para apontar para a API backend.
- Habilite redirecionamento SPA padrão (por exemplo, `_redirects` em Netlify) se necessário.
- Faça o deploy pela CLI ou conectando o repositório Git ao provedor.

## TASK-OPS-012 – Frontend env for API base URL
`.env.example` (frontend):
```
VITE_API_URL=https://api.exemplo.com
```
`api.ts`:
```ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

## TASK-OPS-020 – Manual acceptance test: client flow
1. Acessar app cliente e selecionar barbeiro, serviço, data e horário disponível.
2. Confirmar agendamento e verificar mensagem de sucesso.
3. Criar dois agendamentos adicionais e marcá-los como falta para o mesmo cliente.
4. Tentar criar novo agendamento e verificar bloqueio após atingir limite de faltas.

## TASK-OPS-021 – Manual acceptance test: barber agenda
1. Acessar agenda do barbeiro para o dia corrente.
2. Verificar lista de agendamentos com horários e clientes.
3. Para cada item, marcar status como CONCLUIDO, CANCELADO_CLIENTE, CANCELADO_BARBEIRO ou FALTA.
4. Confirmar que status atualizado aparece na interface e no backend.

## TASK-OPS-022 – Manual acceptance test: blocking behavior
1. Criar cliente e registrar três agendamentos futuros.
2. Marcar os três como FALTA na agenda do barbeiro.
3. Tentar criar novo agendamento para o mesmo cliente.
4. Esperado: sistema impede criação e informa que cliente está bloqueado por exceder limite de faltas.
