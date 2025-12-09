# Codex Project Config – barbearia-agendamento

You are the implementation agent for the project **barbearia-agendamento**.

## Goal
Enable clientes to self-book with barbeiros, allow barbeiros to visualizar/controlar a agenda do dia, e aplicar regras de faltas/bloqueio automático.

## Key references (repo root)
- Arquitetura: `Arquitetura_Sistema_de_Agendamento_para_Barbearia _(V1).md`
- Domínio/entidades/escopo/lifecycle: `Problema_estruturado.md`, `escopo_da_V1.md`, `Modelos_de_entidades.md`, `ciclo_de_vida_do_agendamento.md`, `Sistemas_externos.md`
- Tasks: `codex_tasks.md`

## Repository layout (atual)
- `src/modules/{clientes,barbeiros,servicos,agendamentos}` e `src/shared` (backend Node/TS/Express/Prisma).
- Frontend (Vite/React/TS) ainda não criado; quando criar, use pasta `frontend/`.

## Tech stack
- Backend: Node 18+, TypeScript (strict), Express, Prisma + PostgreSQL, Jest (ts-jest), Zod.
- Frontend: Vite + React + TypeScript, React Router, Axios (`VITE_API_URL` para backend).

## Regras de arquitetura
1) Estrutura de módulos:
   - `interface` (http, dtos), `domain` (entities, use-cases, rules, contracts), `infra` (repositories, mappers, jobs).
2) Domínio não importa de infra. Use-cases dependem apenas de contracts.
3) Controllers finos: validar entrada (Zod) → chamar use-case → responder HTTP.
4) Regras de negócio (lead time, slots, faltas/bloqueio, transições de status) ficam no domínio.
5) Nomeação: código em inglês para classes/métodos/variáveis; seguir casing padrão (PascalCase/camelCase).

## Regras gerais de implementação
- Executar apenas o que a task pede (ex.: `TASK-BE-441`, `TASK-FE-013`), sem renomear/mover pastas.
- TypeScript estrito; evitar `any`.
- Respeitar ESLint/Prettier existentes.
- Testes: Jest em `tests/unit` (e `tests/integration` quando aplicável); usar ts-jest.

## Backend específico
- Pastas por módulo: `interface/http`, `interface/dtos`, `domain/{entities,use-cases,rules,contracts}`, `infra/{repositories,mappers}`.
- Prisma somente em infra (via repositórios concretos). Domínio conhece apenas interfaces.
- Use `V1` lifecycle: estados do agendamento (CONFIRMADO, CONCLUIDO, CANCELADO_CLIENTE, CANCELADO_BARBEIRO, FALTA); antecedência mínima; bloqueio por faltas.
- Controllers validam com Zod, retornam códigos adequados (201/200/400/404/500).

## Frontend específico (quando criado)
- Criar em `frontend/` com Vite + React + TS.
- Rotas: `/` (home), `/agendar`, `/agenda`, `/admin`.
- Axios em `frontend/src/services/api.ts`, `baseURL` de `VITE_API_URL` (desenvolvimento: `http://localhost:3333`).
- Fluxo de agendamento: escolher barbeiro → escolher serviço → escolher data → buscar slots (`/disponibilidade`) → confirmar (criar/buscar cliente + POST `/agendamentos`).
- Agenda barbeiro: GET `/barbeiros/:id/agenda?data=YYYY-MM-DD`; ações concluir/falta/cancelar chamam endpoints e recarregam lista.
- Admin simples: CRUD de serviços, barbeiros (incl. horários), clientes (listar faltas/bloqueio + desbloquear).

## Execução das tasks
- Sempre criar/editar o arquivo exatamente no caminho especificado.
- Não alterar regras de negócio ou estrutura fora do escopo da task.
- Se a task incluir testes, adicioná-los em `tests/...` com Jest configurado.

## Don’ts
- Não mover/renomear módulos (`clientes`, `barbeiros`, `servicos`, `agendamentos`, `shared`).
- Não inventar novos estados/fluxos de agendamento além dos definidos.
- Não deslocar regras de negócio para controllers ou frontend.

