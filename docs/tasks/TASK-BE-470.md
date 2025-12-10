# TASK-BE-470 – Implement client login and client appointments listing endpoints

## Objetivo
- Expor login simples de cliente por telefone (autocadastra se não existir).
- Expor listagem de agendamentos de um cliente.

## Requisitos
1) POST `/clientes/login`
   - Body: `{ telefone: string; nome?: string }`
   - Se cliente existe por telefone, retorna. Se não existir, cria (faltas 0, bloqueado false).
2) GET `/clientes/:id/agendamentos?onlyFuture=bool`
   - Lista agendamentos do cliente. Se `onlyFuture` for true, filtra para futuros.

## Implementação
- Novo use case: `src/modules/clientes/domain/use-cases/LoginCliente.ts`
- Controller: adicionar handler `login` em `ClienteController`, rota em `routes.ts`.
- Novo método no repositório: `IAgendamentoRepository.findForCliente(clienteId: string)`.
- Implementação em `PrismaAgendamentoRepository`.
- Novo use case: `src/modules/agendamentos/domain/use-cases/ListarAgendamentosDoCliente.ts`.
- Controller: adicionar handler `listarByClient` em `AgendamentoController`, rota GET `/clientes/:id/agendamentos`.

## Restrições
- Não alterar regras de negócio existentes (status, bloqueio, antecedência).
- Manter arquitetura: domain → contracts → infra → interface/http.
