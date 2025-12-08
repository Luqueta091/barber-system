PHASE 0 – Business Context and Architecture (já feitos, mas vou incluir)
TASK-BIZ-001 – Understand business problem
Read the document "Problema_estruturado.md". Extract and summarize:
- the main business problem,
- who has this problem (primary and secondary users),
- the current situation and pain points.

Return a concise bullet-point summary focused on what a scheduling system for a barbershop must solve.

TASK-BIZ-002 – Understand V1 scope
Read the document "escopo_da_V1.md". Summarize:
- the main goal of V1,
- all features that are explicitly IN scope,
- all features that are explicitly OUT of scope.

Return a structured summary with headings: "Goal", "In Scope", "Out of Scope", "V1 Ready Criteria".

TASK-BIZ-003 – Understand entities
Read the document "Modelos_de_entidades.md". Summarize:
- the main entities,
- their key fields,
- the relationships between them.

Return a table-like description in plain text for each entity: BARBEIRO, CLIENTE, SERVICO, HORARIO_TRABALHO, AGENDAMENTO.

TASK-BIZ-004 – Understand appointment lifecycle
Read the document "ciclo_de_vida_do_agendamento.md". Summarize:
- all possible states of an appointment,
- all allowed state transitions and who triggers them,
- the temporal rules (lead time for booking and canceling),
- the actions taken when a no-show happens.

Return a clear description that can be used as acceptance criteria for implementing the scheduling logic.

TASK-ARC-001 – Approve architecture
Using the business context and the architecture document that defines modules (clientes, barbeiros, servicos, agendamentos, shared), layers (interface, domain, infra) and folder structure:

1. Re-summarize the architecture in 10–15 bullet points covering:
   - modules,
   - responsibilities,
   - dependencies,
   - layering,
   - key use cases.

2. At the end of the summary, list any open questions or potential risks you see in this architecture.

PHASE 1 – Backend Project Setup
TASK-BE-001 – Create Git repository
I want to start a new backend project called "barbearia-agendamento-backend".

Write the exact Git commands I should run in an empty directory to:
- initialize a Git repository,
- make an initial commit with a README.

Return only the shell commands in order, no explanations.

TASK-BE-002 – Initialize Node + TS project
Generate the exact shell commands I should run to:

1. Initialize a Node.js project with npm (creating package.json).
2. Install TypeScript and ts-node-dev (or nodemon + ts-node) as dev dependencies.
3. Create a basic tsconfig.json targeting Node 18+ with strict type checking.

Return only the commands and, if needed, the contents of tsconfig.json in a separate code block.

TASK-BE-003 – Add npm scripts
Given a Node + TypeScript project, update package.json to include these scripts:

- "dev": run the app in development with automatic restart using ts-node-dev (or nodemon + ts-node).
- "build": compile TypeScript from src to dist.
- "start": run the compiled JavaScript from dist.

Return only the complete "scripts" section of package.json, valid JSON.

TASK-BE-004 – Install backend dependencies
Write the npm commands to install the following runtime dependencies for a REST API:

- express
- cors
- dotenv
- zod (for validation)

Return only the single npm install command, no explanations.

TASK-BE-005 – Install dev dependencies
Write the npm commands to install these dev dependencies:

- typescript
- ts-node-dev (or nodemon + ts-node)
- @types/node
- @types/express
- jest
- ts-jest
- supertest

Return only the npm command(s), optimized to use as few commands as possible.

TASK-BE-006 – Configure tsconfig
Create a TypeScript configuration file for a Node 18+ backend with:

- "rootDir": "src"
- "outDir": "dist"
- "strict": true
- module resolution compatible with Node/ESNext
- support for ES module syntax or commonjs (choose one and be consistent)

Return the full contents of tsconfig.json only.

TASK-BE-010 – Create app.ts
In a Node.js + TypeScript Express project, create the file `src/main/app.ts` that:

- imports express and cors,
- creates an Express app,
- configures JSON body parsing and CORS,
- imports a router from `src/main/routes`,
- mounts the router under `/`,
- exports the Express app instance.

Return only the complete TypeScript code for `src/main/app.ts`.

TASK-BE-011 – Create server.ts
Create the file `src/main/server.ts` that:

- imports the Express app from `src/main/app`,
- reads the PORT from process.env.PORT with a default (e.g. 3333),
- starts the HTTP server and logs that it is listening.

Return only the complete TypeScript code for `src/main/server.ts`.

TASK-BE-012 – Create routes.ts
Create the file `src/main/routes.ts` that:

- imports `Router` from express,
- instantiates a router,
- defines placeholder routers for `/clientes`, `/barbeiros`, `/servicos`, `/agendamentos` (each can just respond with a 200 and a simple JSON for now),
- exports the router.

Return only the complete TypeScript code for `src/main/routes.ts`.

PHASE 2 – Shared Infrastructure and Database
TASK-BE-020 – Create shared/infra folder
Describe the directory and file structure I should create under `src/shared/infra` for:

- database configuration (`database.ts`),
- logger (`logger.ts`),
- a potential `prisma/` folder.

Return the tree structure in a code block (no code yet), starting at `src/`.

TASK-BE-021 – Implement database.ts stub
Create the file `src/shared/infra/database.ts` that:

- imports and configures dotenv to load environment variables,
- exports a placeholder object named `db` (for now, just an empty object or a simple interface) to be replaced by a Prisma client later.

Return only the TypeScript code for `database.ts`.

TASK-BE-022 – Implement logger.ts
Create the file `src/shared/infra/logger.ts` with a simple logger implementation that:

- exports `logger` with methods: `info`, `error`, and `warn`,
- each method simply delegates to `console.log`, `console.error`, or `console.warn` and prefixes messages with a level tag.

Return only the TypeScript code for `logger.ts`.

TASK-BE-030 – Install Prisma
Generate the npm commands to:

1. Install Prisma and the Prisma client in a Node.js project.
2. Initialize Prisma to create a default `prisma/schema.prisma` and `.env` file.

Return only the commands, in order.

TASK-BE-031 – Initialize Prisma
Assume Prisma is installed. Generate the command to initialize Prisma in the project, creating the `prisma` folder and `schema.prisma`.

Return only that command and nothing else.

TASK-BE-032 – Configure DATABASE_URL
Provide an example `.env` file for this project that defines:

- `DATABASE_URL` pointing to a local PostgreSQL database called `barbearia_agendamento`,
- `PORT=3333`.

Return only the complete contents of `.env.example`, not `.env`, and comment that developers should copy it to `.env`.

TASK-BE-033 – Define Barbeiro model
In `prisma/schema.prisma`, define a Prisma model `Barbeiro` with fields:

- id: String @id @default(uuid())
- nome: String
- telefone: String
- ativo: Boolean
- corAgenda: String? (optional)

Return only the Prisma model definition for `Barbeiro`.

TASK-BE-034 – Define Cliente model
In `prisma/schema.prisma`, define a Prisma model `Cliente` with fields:

- id: String @id @default(uuid())
- nome: String
- telefone: String
- faltas: Int @default(0)
- bloqueado: Boolean @default(false)

Return only the Prisma model definition for `Cliente`.

TASK-BE-035 – Define Servico model
In `prisma/schema.prisma`, define a Prisma model `Servico` with fields:

- id: String @id @default(uuid())
- nome: String
- duracaoMinutos: Int
- preco: Decimal
- ativo: Boolean

Include a proper Decimal configuration if needed.

Return only the Prisma model definition for `Servico`.

TASK-BE-036 – Define HorarioTrabalho model
In `prisma/schema.prisma`, define a Prisma model `HorarioTrabalho` with fields:

- id: String @id @default(uuid())
- barbeiroId: String
- diaSemana: Int
- horaInicio: DateTime
- horaFim: DateTime

Also add a relation to `Barbeiro` via `barbeiroId`.

Return only the Prisma model definition for `HorarioTrabalho` including the relation.

TASK-BE-037 – Define Agendamento model
In `prisma/schema.prisma`, define a Prisma model `Agendamento` with fields:

- id: String @id @default(uuid())
- barbeiroId: String
- clienteId: String
- servicoId: String
- dataHoraInicio: DateTime
- dataHoraFim: DateTime
- status: String
- origem: String
- observacoes: String?

Add relations to `Barbeiro`, `Cliente`, and `Servico` via their respective IDs.

Return only the Prisma model definition for `Agendamento` including all relations.

TASK-BE-038 – Wire relations between models
Combine the previously created Prisma models (`Barbeiro`, `Cliente`, `Servico`, `HorarioTrabalho`, `Agendamento`) into a consistent `schema.prisma` snippet where:

- Barbeiro has one-to-many HorarioTrabalho and Agendamento.
- Cliente has one-to-many Agendamento.
- Servico has one-to-many Agendamento.

Return only the full `schema.prisma` contents for these models including datasource and generator blocks (PostgreSQL + PrismaClient).

TASK-BE-039 – Run migrations
Generate the exact command to run Prisma migrations in development, creating the database tables from schema.prisma.

Assume the migration name should be "init". Return only the single command.

TASK-BE-040 – Export Prisma client in database.ts
Update `src/shared/infra/database.ts` to:

- import `PrismaClient` from `@prisma/client`,
- instantiate a single PrismaClient,
- export it as `prisma`,
- handle basic process exit (if needed).

Return only the updated TypeScript code for `database.ts`.

TASK-BE-045 – Create shared/types folder
Describe the folder structure under `src/shared/types` that will hold:

- a generic Result type,
- a DomainError type.

Return the directory tree in a code block, starting at `src/`.

TASK-BE-046 – Implement Result type
Create the file `src/shared/types/Result.ts` that defines a generic Result type with:

- `success: boolean`
- `data?: T`
- `error?: string`

Export a TypeScript type or interface and, optionally, helper factory functions `ok(data)` and `fail(error)`.

Return only the TypeScript code.

TASK-BE-047 – Implement DomainError type
Create the file `src/shared/types/DomainError.ts` that:

- exports a class `DomainError` extending `Error`,
- has a `code: string` property,
- accepts `message` and `code` in the constructor.

Return only the TypeScript code.

TASK-BE-048 – Create shared/utils folder
Describe the folder and file structure for `src/shared/utils`, including:

- `dateUtils.ts`
- `validationUtils.ts`

Return the directory tree listing these files.

TASK-BE-049 – Implement dateUtils
Create `src/shared/utils/dateUtils.ts` with helper functions:

- `combineDateAndTime(date: Date, time: string): Date`
- `addMinutes(date: Date, minutes: number): Date`
- `isAtLeastMinutesFromNow(date: Date, minutes: number): boolean`

Return only the TypeScript code for these utilities.

PHASE 3 – Backend Module: Clientes
TASK-BE-100 – Create clientes module folder structure
Describe the folder structure that should be created for the `clientes` module under `src/modules/clientes` with subfolders:

- interface/http
- interface/dtos
- domain/entities
- domain/use-cases
- domain/rules
- domain/contracts
- infra/repositories
- infra/mappers

Return the directory tree starting at `src/modules/clientes`.

TASK-BE-101 – Physically create folders (script)
Generate a POSIX shell script (bash) that, when run from the project root, creates all folders required for the `clientes` module as described previously.

Return only the shell script.

TASK-BE-110 – Implement Cliente entity
Create `src/modules/clientes/domain/entities/Cliente.ts` that defines a TypeScript class `Cliente` with fields:

- id: string
- nome: string
- telefone: string
- faltas: number
- bloqueado: boolean

Include:
- a constructor or static factory method,
- simple methods to increment faltas and to block/unblock the client.

Return only the TypeScript code.

TASK-BE-111 – Implement RegraDeBloqueioPorFaltas
Create `src/modules/clientes/domain/rules/RegraDeBloqueioPorFaltas.ts` that exports a function:

`shouldBlockClient(faltas: number, limit: number): boolean`

The function returns true when `faltas >= limit`.

Return only the TypeScript code.

TASK-BE-120 – Define IClienteRepository interface
Create `src/modules/clientes/domain/contracts/IClienteRepository.ts` that exports a TypeScript interface `IClienteRepository` with methods:

- `create(cliente: Cliente): Promise<Cliente>`
- `update(cliente: Cliente): Promise<Cliente>`
- `findById(id: string): Promise<Cliente | null>`
- `findByPhone(phone: string): Promise<Cliente | null>`
- `incrementFaltas(id: string): Promise<Cliente>`

Import `Cliente` from the entities folder. Return only the TypeScript code.

TASK-BE-121 – Implement PrismaClienteRepository
Create `src/modules/clientes/infra/repositories/PrismaClienteRepository.ts` that:

- imports `prisma` from `src/shared/infra/database`,
- implements `IClienteRepository`,
- maps between Prisma's `cliente` model and the domain `Cliente` entity,
- provides concrete implementations for all interface methods.

Use a separate `ClienteMapper` class if needed, but keep this file focused on repository logic.

Return only the TypeScript code for `PrismaClienteRepository`.

TASK-BE-122 – Implement ClienteMapper
Create `src/modules/clientes/infra/mappers/ClienteMapper.ts` that:

- exports functions to convert between Prisma `Cliente` records and the domain `Cliente` entity:
  - `toDomain(prismaCliente): Cliente`
  - `toPrisma(cliente: Cliente): any` (Prisma create/update input)

Return only the TypeScript code.

TASK-BE-130 – Implement CadastrarCliente use case
Create `src/modules/clientes/domain/use-cases/CadastrarCliente.ts` that defines a use case class `CadastrarCliente` with a method `execute(input)` where:

- `input` has: `nome: string`, `telefone: string`.
- It uses `IClienteRepository` injected via constructor.
- It validates required fields (non-empty).
- It checks if a client with the same phone already exists and fails if so.
- It creates a new `Cliente` with faltas = 0 and bloqueado = false.
- It saves the client and returns it (or a Result wrapper if you prefer).

Return only the TypeScript code for this use case.

TASK-BE-131 – Implement AtualizarCliente use case
Create `src/modules/clientes/domain/use-cases/AtualizarCliente.ts` with a class `AtualizarCliente` that:

- has an `execute(input)` method with: `id: string`, optional `nome?: string`, optional `telefone?: string`,
- loads the client by id,
- applies changes to nome/telefone if provided,
- persists the updated client,
- returns the updated client.

Use `IClienteRepository` via constructor injection. Return only the TypeScript code.

TASK-BE-132 – Implement RegistrarFaltaCliente use case
Create `src/modules/clientes/domain/use-cases/RegistrarFaltaCliente.ts` with a class `RegistrarFaltaCliente` that:

- has an `execute({ clienteId, limitFaltas })` method (limitFaltas with a default like 3),
- loads the client by id,
- increments the faltas count,
- uses `shouldBlockClient` from `RegraDeBloqueioPorFaltas` to set `bloqueado` when faltas >= limit,
- saves the client and returns the updated client.

Use `IClienteRepository` via constructor injection. Return only the TypeScript code.

TASK-BE-133 – Implement DesbloquearCliente use case
Create `src/modules/clientes/domain/use-cases/DesbloquearCliente.ts` with a class `DesbloquearCliente` that:

- has an `execute({ clienteId })` method,
- loads the client,
- sets `bloqueado = false` (you can keep faltas as is),
- saves and returns the updated client.

Use `IClienteRepository`. Return only the TypeScript code.

TASK-BE-140 – Define cliente DTOs
Under `src/modules/clientes/interface/dtos`, create:

1. `CriarClienteDTO.ts` – define the shape of the request body for creating a client: nome, telefone.
2. `AtualizarClienteDTO.ts` – define optional fields for updating: nome?, telefone?.
3. `ClienteResponseDTO.ts` – define the shape returned to API consumers, hiding any internal-only fields if needed.

Use TypeScript types or interfaces and export them. Return only the TypeScript code for all three files, clearly separated.

TASK-BE-141 – Implement ClienteController
Create `src/modules/clientes/interface/http/ClienteController.ts` that exports a class or a set of handler functions for:

- POST `/clientes` → uses `CadastrarCliente`,
- PUT `/clientes/:id` → uses `AtualizarCliente`,
- POST `/clientes/:id/desbloquear` → uses `DesbloquearCliente`.

Each handler should:
- validate the request body with zod (or a simple manual check),
- call the corresponding use case,
- return appropriate HTTP status codes and JSON.

Return only the TypeScript code.

TASK-BE-142 – Wire clientes routes in main router
Update `src/main/routes.ts` so that:

- it imports the ClienteController (or its router),
- registers routes under `/clientes` pointing to the controller methods.

Return only the updated TypeScript code for `routes.ts`.

PHASE 4 – Backend Module: Barbeiros
TASK-BE-200 – Create barbeiros module folders
Describe and then generate a bash script that creates the folder structure for `src/modules/barbeiros` with:

- interface/http
- domain/entities
- domain/use-cases
- domain/contracts
- infra/repositories
- infra/mappers

Return first the directory tree, then the shell script.

TASK-BE-210 – Implement Barbeiro entity
Create `src/modules/barbeiros/domain/entities/Barbeiro.ts` defining a class `Barbeiro` with fields:

- id: string
- nome: string
- telefone: string
- ativo: boolean

Include any simple helper methods you find useful (e.g., activate/deactivate). Return only the TypeScript code.

TASK-BE-211 – Implement HorarioTrabalho entity
Create `src/modules/barbeiros/domain/entities/HorarioTrabalho.ts` defining a class `HorarioTrabalho` with fields:

- id: string
- barbeiroId: string
- diaSemana: number
- horaInicio: Date
- horaFim: Date

Return only the TypeScript code.

TASK-BE-220 – Define IBarbeiroRepository
Create `src/modules/barbeiros/domain/contracts/IBarbeiroRepository.ts` that:

- imports `Barbeiro`,
- exports an interface with methods to create, update, find by id, and list all active barbers.

Return only the TypeScript code.

TASK-BE-221 – Define IHorarioTrabalhoRepository
Create `src/modules/barbeiros/domain/contracts/IHorarioTrabalhoRepository.ts` that:

- imports `HorarioTrabalho`,
- exports an interface with methods to create, update, list by barbeiroId, and list by barbeiroId + diaSemana.

Return only the TypeScript code.

TASK-BE-222 – Implement PrismaBarbeiroRepository
Create `src/modules/barbeiros/infra/repositories/PrismaBarbeiroRepository.ts` implementing `IBarbeiroRepository` using Prisma:

- map between Prisma `barbeiro` and domain `Barbeiro`,
- implement create, update, findById, listActive methods.

Return only the TypeScript code.

TASK-BE-223 – Implement PrismaHorarioTrabalhoRepository
Create `src/modules/barbeiros/infra/repositories/PrismaHorarioTrabalhoRepository.ts` implementing `IHorarioTrabalhoRepository` using Prisma:

- map between Prisma `horarioTrabalho` and domain `HorarioTrabalho`,
- implement methods to manage working hours for each barber.

Return only the TypeScript code.

TASK-BE-230 – Implement CadastrarBarbeiro use case
Create `src/modules/barbeiros/domain/use-cases/CadastrarBarbeiro.ts` with a class `CadastrarBarbeiro` that:

- receives `IBarbeiroRepository` via constructor,
- exposes `execute({ nome, telefone })`,
- creates a Barbeiro with `ativo = true`,
- persists and returns it.

Return only the TypeScript code.

TASK-BE-231 – Implement AtualizarBarbeiro use case
Create `src/modules/barbeiros/domain/use-cases/AtualizarBarbeiro.ts` with a class `AtualizarBarbeiro` that:

- exposes `execute({ id, nome?, telefone? })`,
- updates existing barber fields if provided,
- persists and returns the updated barber.

Return only the TypeScript code.

TASK-BE-232 – Implement AtivarInativarBarbeiro use case
Create `src/modules/barbeiros/domain/use-cases/AtivarInativarBarbeiro.ts` with a class `AtivarInativarBarbeiro` that:

- exposes `execute({ id, ativo })`,
- loads the barber, sets `ativo`, saves and returns.

Return only the TypeScript code.

TASK-BE-233 – Implement ConfigurarHorarioTrabalho use case
Create `src/modules/barbeiros/domain/use-cases/ConfigurarHorarioTrabalho.ts` with a class `ConfigurarHorarioTrabalho` that:

- exposes `execute({ barbeiroId, diaSemana, horaInicio, horaFim })`,
- validates that `horaInicio < horaFim`,
- creates or updates a HorarioTrabalho for that barber/day,
- persists and returns it.

Use `IHorarioTrabalhoRepository`. Return only the TypeScript code.

TASK-BE-234 – Implement ListarHorariosTrabalhoDoBarbeiro use case
Create `src/modules/barbeiros/domain/use-cases/ListarHorariosTrabalhoDoBarbeiro.ts` with a class that:

- exposes `execute({ barbeiroId, diaSemana? })`,
- returns a list of HorarioTrabalho for the given barber, optionally filtered by day.

Return only the TypeScript code.

TASK-BE-240 – Implement BarbeiroController
Create `src/modules/barbeiros/interface/http/BarbeiroController.ts` that defines HTTP handlers for:

- POST `/barbeiros` → create barber,
- PUT `/barbeiros/:id` → update barber,
- PATCH `/barbeiros/:id/status` → activate/deactivate,
- GET `/barbeiros/:id/horarios` → list working hours,
- POST `/barbeiros/:id/horarios` → configure working hours.

Each handler validates input, calls the corresponding use case, and returns JSON. Return only the TypeScript code.

TASK-BE-241 – Wire barbeiros routes
Update `src/main/routes.ts` to:

- import BarbeiroController or its router for `/barbeiros`,
- register all barber-related routes under `/barbeiros`.

Return only the updated TypeScript code for `routes.ts`.

PHASE 5 – Backend Module: Serviços
TASK-BE-300 – Create servicos module folders
Describe the folder structure for `src/modules/servicos` with:

- interface/http
- domain/entities
- domain/use-cases
- domain/contracts
- infra/repositories
- infra/mappers

Then generate a bash script to create these folders from the project root. Return tree + script.

TASK-BE-310 – Implement Servico entity
Create `src/modules/servicos/domain/entities/Servico.ts` that defines a class `Servico` with:

- id: string
- nome: string
- duracaoMinutos: number
- preco: number or Decimal-compatible type
- ativo: boolean

Return only the TypeScript code.

TASK-BE-320 – Define IServicoRepository
Create `src/modules/servicos/domain/contracts/IServicoRepository.ts` with methods to:

- create,
- update,
- findById,
- listActive services.

Return only the TypeScript code.

TASK-BE-321 – Implement PrismaServicoRepository
Create `src/modules/servicos/infra/repositories/PrismaServicoRepository.ts` that:

- implements `IServicoRepository` using Prisma,
- maps between Prisma `servico` and domain `Servico`.

Return only the TypeScript code.

TASK-BE-322 – Implement CadastrarServico use case
Create `src/modules/servicos/domain/use-cases/CadastrarServico.ts` with a class that:

- exposes `execute({ nome, duracaoMinutos, preco })`,
- creates a service with `ativo = true`,
- persists and returns it.

Return only the TypeScript code.

TASK-BE-323 – Implement AtualizarServico use case
Create `src/modules/servicos/domain/use-cases/AtualizarServico.ts` that:

- exposes `execute({ id, nome?, duracaoMinutos?, preco? })`,
- updates existing fields if provided,
- saves and returns the service.

Return only the TypeScript code.

TASK-BE-324 – Implement AtivarInativarServico use case
Create `src/modules/servicos/domain/use-cases/AtivarInativarServico.ts` that:

- exposes `execute({ id, ativo })`,
- loads the service, updates `ativo`, saves and returns.

Return only the TypeScript code.

TASK-BE-325 – Implement ListarServicosAtivos use case
Create `src/modules/servicos/domain/use-cases/ListarServicosAtivos.ts` that:

- has `execute()` with no input,
- returns all services where `ativo = true`.

Return only the TypeScript code.

TASK-BE-330 – Implement ServicoController
Create `src/modules/servicos/interface/http/ServicoController.ts` with handlers for:

- POST `/servicos` → create service,
- PUT `/servicos/:id` → update,
- PATCH `/servicos/:id/status` → activate/deactivate,
- GET `/servicos` → list active services.

Use zod or simple validation and call the corresponding use cases. Return only the TypeScript code.

TASK-BE-331 – Wire servicos routes
Update `src/main/routes.ts` to register routes for services under `/servicos` using ServicoController or a router.

Return only the updated TypeScript code.

PHASE 6 – Backend Module: Agendamentos
TASK-BE-400 – Create agendamentos module folders
Describe the folder structure for `src/modules/agendamentos` with:

- interface/http
- interface/dtos
- domain/entities
- domain/use-cases
- domain/rules
- domain/contracts
- infra/repositories
- infra/mappers

Then generate a bash script to create all of these folders. Return tree + script.

TASK-BE-410 – Implement Agendamento entity
Create `src/modules/agendamentos/domain/entities/Agendamento.ts` that defines a class `Agendamento` with:

- id: string
- barbeiroId: string
- clienteId: string
- servicoId: string
- dataHoraInicio: Date
- dataHoraFim: Date
- status: string (e.g., 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO_CLIENTE', 'CANCELADO_BARBEIRO', 'FALTA')
- origem: string ('cliente' or 'barbeiro')
- observacoes?: string

Include methods to change status respecting the allowed transitions from the lifecycle document.

Return only the TypeScript code.

TASK-BE-411 – Implement status transition methods
Extend `Agendamento` in `Agendamento.ts` with methods:

- `markConcluido()`
- `cancelByCliente()`
- `cancelByBarbeiro()`
- `markFalta()`

Each method should:
- validate the current status is `CONFIRMADO`,
- throw a DomainError if the transition is not allowed,
- set the appropriate new status.

Return only the updated TypeScript code for the `Agendamento` class.

TASK-BE-420 – Define IAgendamentoRepository
Create `src/modules/agendamentos/domain/contracts/IAgendamentoRepository.ts` with methods:

- `create(agendamento: Agendamento): Promise<Agendamento>`
- `update(agendamento: Agendamento): Promise<Agendamento>`
- `findById(id: string): Promise<Agendamento | null>`
- `findForBarbeiroOnDay(barbeiroId: string, date: Date): Promise<Agendamento[]>`
- `findConflicting(barbeiroId: string, start: Date, end: Date): Promise<Agendamento[]>`

Return only the TypeScript code.

TASK-BE-421 – Implement PrismaAgendamentoRepository
Create `src/modules/agendamentos/infra/repositories/PrismaAgendamentoRepository.ts` that:

- implements `IAgendamentoRepository` with Prisma,
- maps between Prisma `agendamento` and domain `Agendamento`,
- correctly filters by date range and status when needed.

Return only the TypeScript code.

TASK-BE-422 – Implement AgendamentoMapper
Create `src/modules/agendamentos/infra/mappers/AgendamentoMapper.ts` with functions:

- `toDomain(prismaAgendamento): Agendamento`
- `toPrisma(agendamento: Agendamento): any`

Return only the TypeScript code.

TASK-BE-430 – Implement ValidadorAntecedencia
Create `src/modules/agendamentos/domain/rules/ValidadorAntecedencia.ts` that exports a function:

`isValidLeadTime(targetDate: Date, minMinutes: number): boolean`

The function should return true if `targetDate` is at least `minMinutes` in the future relative to now. Use dateUtils if available.

Return only the TypeScript code.

TASK-BE-431 – Implement CalculadorDeSlots
Create `src/modules/agendamentos/domain/rules/CalculadorDeSlots.ts` that exports a function to calculate available time slots:

`calculateSlots(params: { horariosTrabalho: HorarioTrabalho[]; duracaoMinutos: number; agendamentosExistentes: Agendamento[]; data: Date; minLeadTimeMinutes: number; }): { inicio: Date; fim: Date; }[]`

Rules:
- slots must be within working hours,
- slots must not overlap existing CONFIRMADO appointments,
- slots in the past or violating the lead time are excluded.

Return only the TypeScript code.

TASK-BE-440 – Implement ListarHorariosDisponiveis use case
Create `src/modules/agendamentos/domain/use-cases/ListarHorariosDisponiveis.ts` with a class that:

- exposes `execute({ barbeiroId, servicoId, data })`,
- loads the service to get `duracaoMinutos`,
- loads working hours for the barber and that day,
- loads existing appointments for that barber/date with status CONFIRMADO,
- calls `calculateSlots` to compute available slots,
- returns the list of available slots.

Use repository interfaces from `servicos`, `barbeiros`, and `agendamentos`. Return only the TypeScript code.

TASK-BE-441 – Implement CriarAgendamento use case
Create `src/modules/agendamentos/domain/use-cases/CriarAgendamento.ts` with a class `CriarAgendamento` that:

- exposes `execute({ clienteId, barbeiroId, servicoId, dataHoraInicio, origem })`,
- loads the client and checks `bloqueado == false`,
- loads the service and barber,
- computes `dataHoraFim = dataHoraInicio + duracaoMinutos`,
- validates lead time with `isValidLeadTime`,
- checks for conflicting appointments via `IAgendamentoRepository.findConflicting`,
- creates an Agendamento with status 'CONFIRMADO',
- saves and returns it.

Use repositories from `clientes`, `barbeiros`, `servicos`, and `agendamentos`. Return only the TypeScript code.

TASK-BE-450 – Implement CancelarAgendamentoCliente use case
Create `src/modules/agendamentos/domain/use-cases/CancelarAgendamentoCliente.ts` with a class that:

- exposes `execute({ agendamentoId, clienteId })`,
- loads the appointment,
- verifies it belongs to the given client,
- ensures status is CONFIRMADO,
- optionally validates cancellation lead time,
- calls the entity method to set status to CANCELADO_CLIENTE,
- saves and returns the updated appointment.

Return only the TypeScript code.

TASK-BE-451 – Implement CancelarAgendamentoBarbeiro use case
Create `src/modules/agendamentos/domain/use-cases/CancelarAgendamentoBarbeiro.ts` with a class that:

- exposes `execute({ agendamentoId, barbeiroId })`,
- loads the appointment,
- verifies it belongs to the given barber,
- ensures status is CONFIRMADO,
- sets status to CANCELADO_BARBEIRO using the entity method,
- saves and returns the updated appointment.

Return only the TypeScript code.

TASK-BE-452 – Implement MarcarAgendamentoConcluido use case
Create `src/modules/agendamentos/domain/use-cases/MarcarAgendamentoConcluido.ts` that:

- exposes `execute({ agendamentoId, barbeiroId })`,
- loads the appointment,
- verifies barber ownership and current status == CONFIRMADO,
- calls entity method to mark as CONCLUIDO,
- saves and returns the updated appointment.

Return only the TypeScript code.

TASK-BE-453 – Implement RegistrarFaltaAgendamento use case
Create `src/modules/agendamentos/domain/use-cases/RegistrarFaltaAgendamento.ts` that:

- exposes `execute({ agendamentoId, barbeiroId })`,
- loads the appointment,
- verifies barber ownership and current status == CONFIRMADO,
- calls entity method to set status to FALTA,
- saves the appointment,
- calls the `RegistrarFaltaCliente` use case from the `clientes` module passing the `clienteId`.

Return only the TypeScript code.

TASK-BE-454 – Implement ListarAgendaDoDia use case
Create `src/modules/agendamentos/domain/use-cases/ListarAgendaDoDia.ts` that:

- exposes `execute({ barbeiroId, data })`,
- loads all appointments for that barber on that date,
- sorts them by `dataHoraInicio`,
- optionally enriches with client and service basic info (name, duration),
- returns a list of appointments suitable for showing an agenda.

Return only the TypeScript code.

TASK-BE-460 – Define agendamento DTOs
Under `src/modules/agendamentos/interface/dtos`, create:

- `CriarAgendamentoDTO.ts` – request body shape for creating an appointment.
- `CancelarAgendamentoDTO.ts` – request params/body shape for canceling.
- `AgendamentoResponseDTO.ts` – response shape for returning appointment data.

Use TypeScript interfaces or types and export them. Return only the TypeScript code for all three.

TASK-BE-461 – Implement AgendamentoController
Create `src/modules/agendamentos/interface/http/AgendamentoController.ts` that defines handlers for:

- GET `/disponibilidade` → calls ListarHorariosDisponiveis,
- POST `/agendamentos` → calls CriarAgendamento,
- DELETE `/agendamentos/:id` → calls CancelarAgendamentoCliente,
- DELETE `/agendamentos/:id/barbeiro` → calls CancelarAgendamentoBarbeiro,
- POST `/agendamentos/:id/concluir` → calls MarcarAgendamentoConcluido,
- POST `/agendamentos/:id/falta` → calls RegistrarFaltaAgendamento,
- GET `/barbeiros/:id/agenda` → calls ListarAgendaDoDia.

Validate input, call use cases, and return JSON. Return only the TypeScript code.

TASK-BE-462 – Wire agendamentos routes
Update `src/main/routes.ts` to mount all scheduling-related routes using AgendamentoController under suitable paths:

- `/disponibilidade`
- `/agendamentos`
- `/barbeiros/:id/agenda`

Return only the updated TypeScript code.

PHASE 7 – Cross-cutting Backend Concerns
TASK-BE-500 – Global error handler middleware
Create `src/main/middlewares/errorHandler.ts` with an Express error-handling middleware that:

- detects DomainError instances and returns a 400–422 with `code` and `message`,
- logs unexpected errors,
- returns a 500 JSON error with a generic message for unknown errors.

Return only the TypeScript code.

TASK-BE-501 – Plug error handler into app
Update `src/main/app.ts` to import and use the `errorHandler` middleware after all routes.

Return only the updated TypeScript code for `app.ts`.

TASK-BE-502 – Use zod validation in controllers
Pick one controller (e.g., AgendamentoController) and:

- add zod schemas for the request body/query of its endpoints,
- validate input before calling use cases,
- return 400 on validation errors.

Show the updated controller file using zod. Return only the TypeScript code.

TASK-BE-510 – Implement auth middleware stub
Create `src/shared/auth/middleware.ts` with an Express middleware `fakeAuth` that:

- for now, just attaches a dummy `user` object to `req` (e.g., `{ id: 'barbeiro-demo' }`),
- calls `next()`.

Return only the TypeScript code.

TASK-BE-511 – Protect barber-only endpoints
Update relevant routes in `src/main/routes.ts` or the controllers so that:

- barber-only actions (mark conclude, mark no-show, barber cancel, view agenda) use the `fakeAuth` middleware.

Return only the updated TypeScript code for the routes file (or the router where you attach the middleware).

PHASE 8 – Frontend Web
TASK-FE-001 – Create React + TS frontend
Generate the command to create a new React + TypeScript project called `barbearia-agendamento-frontend` using Vite (preferred) or Create React App.

Return only the single command.

TASK-FE-002 – Configure routing
In a React + TypeScript app, set up React Router with basic routes:

- `/` – home or entry screen,
- `/agendar` – client booking flow,
- `/agenda` – barber agenda,
- `/admin` – basic admin.

Return only the TypeScript/JSX code for the main router component (e.g., App.tsx) configuring these routes.

TASK-FE-003 – HTTP client setup
Create `src/services/api.ts` in the React app that:

- exports an Axios instance (or fetch wrapper),
- sets the baseURL from an environment variable (e.g., VITE_API_URL),
- has basic error handling.

Return only the TypeScript code.

TASK-FE-010 – Choose Barber page
Create a React component `ChooseBarberPage` that:

- on mount, calls GET `/barbeiros` (you can assume such endpoint exists listing all active barbers),
- displays the barbers in a list,
- lets the user select one and proceed to the next step (you can just log or call a callback).

Return only the TypeScript/JSX code for this component.

TASK-FE-011 – Choose Service page
Create a React component `ChooseServicePage` that:

- fetches services from GET `/servicos`,
- shows a list of active services,
- lets the user select one and proceed.

Return only the TypeScript/JSX code.

TASK-FE-012 – Choose Date step
Create a React component `ChooseDateStep` that:

- allows selecting a date (use a simple HTML date input),
- on change, calls a parent callback (e.g., `onDateSelected(date)`).

Return only the TypeScript/JSX code for the component, no styling required.

TASK-FE-013 – Choose Time Slot step
Create a React component `ChooseTimeSlotStep` that:

- receives `barbeiroId`, `servicoId`, and `date` as props,
- calls GET `/disponibilidade` with these parameters,
- displays the returned slots as buttons,
- lets the user select a slot and calls `onSlotSelected(slot)`.

Return only the TypeScript/JSX code.

TASK-FE-014 – Confirm Booking step
Create a React component `ConfirmBookingStep` that:

- collects client name and phone,
- calls the backend to create or get the client (POST `/clientes` or similar),
- then calls POST `/agendamentos` with the chosen barber, service, date/time and client,
- shows success or error message.

Return only the TypeScript/JSX code, assuming an `api` client helper exists.

TASK-FE-020 – Simple barber selection / login
Create a React component `BarberSelector` that:

- fetches active barbers from `/barbeiros`,
- allows selecting one barber to act as "logged in" barber,
- stores the selected barber ID in React state or context.

Return only the TypeScript/JSX code.

TASK-FE-021 – Agenda do Dia page
Create a React component `AgendaDoDiaPage` that:

- receives `barbeiroId` (from props or context),
- allows choosing a date,
- calls GET `/barbeiros/:id/agenda?data=YYYY-MM-DD`,
- displays the list of appointments with hour, client name, service and status.

Return only the TypeScript/JSX code.

TASK-FE-022 – Agenda actions (concluir / falta / cancelar)
Extend the `AgendaDoDiaPage` (or a nested component) so that each appointment has buttons:

- "Concluir" → POST `/agendamentos/:id/concluir`,
- "Falta" → POST `/agendamentos/:id/falta`,
- "Cancelar" → DELETE `/agendamentos/:id/barbeiro`.

After each action, refresh the agenda. Return the updated TypeScript/JSX code.

TASK-FE-023 – Refresh after actions
Ensure `AgendaDoDiaPage` automatically re-fetches the agenda list after any action that changes appointment status (conclude, no-show, cancel).

Implement this behavior in the React code and return only the relevant updated component code.

TASK-FE-030 – Manage Services page
Create a React page `ManageServicesPage` that:

- lists services from `/servicos`,
- allows creating a new service (POST `/servicos`),
- allows editing an existing service (PUT `/servicos/:id`),
- allows toggling active/inactive (PATCH `/servicos/:id/status`).

Use simple forms and buttons; focus on API calls and state handling. Return only the TypeScript/JSX code.

TASK-FE-031 – Manage Barbers page
Create a React page `ManageBarbersPage` that:

- lists barbers,
- allows creating/updating barbers,
- allows toggling active status,
- allows configuring working hours for a selected barber by calling the appropriate backend endpoints.

Return only the TypeScript/JSX code.

TASK-FE-032 – Manage Clients page
Create a React page `ManageClientsPage` that:

- lists clients with their faltas and bloqueado status,
- provides a button to unlock a client (POST `/clientes/:id/desbloquear` or similar),
- refreshes the list after unlocking.

Return only the TypeScript/JSX code.

PHASE 9 – Testing and Quality
TASK-QA-001 – Configure Jest
In the Node + TypeScript backend, configure Jest by:

- creating a `jest.config.js` or `jest.config.ts` using ts-jest,
- setting test environment to node,
- ensuring tests in `tests` folder are detected.

Return only the Jest config file contents.

TASK-QA-002 – Unit tests for RegraDeBloqueioPorFaltas
Create Jest unit tests in `tests/unit/RegraDeBloqueioPorFaltas.spec.ts` that:

- verify that faltas < limit does NOT block,
- verify that faltas >= limit DOES block.

Return only the TypeScript test code.

TASK-QA-003 – Unit tests for CalculadorDeSlots
Create Jest unit tests in `tests/unit/CalculadorDeSlots.spec.ts` that:

- test slot generation inside working hours,
- test that overlapping slots with existing appointments are removed,
- test that past slots and slots violating lead time are excluded.

Return only the TypeScript test code.

TASK-QA-004 – Unit tests for CriarAgendamento
Create Jest unit tests in `tests/unit/CriarAgendamento.spec.ts` that cover:

- cannot schedule when client is blocked,
- cannot schedule when there is a conflicting appointment,
- cannot schedule when lead time is violated,
- successful scheduling returns a CONFIRMADO appointment.

Use mocked repositories. Return only the TypeScript test code.

TASK-QA-005 – Unit tests for RegistrarFaltaAgendamento
Create Jest unit tests in `tests/unit/RegistrarFaltaAgendamento.spec.ts` that verify:

- appointment status is changed to FALTA,
- the client's faltas counter is incremented,
- the client is blocked when faltas reach the limit.

Use mocks for Cliente and Agendamento repositories. Return only the TypeScript test code.

TASK-QA-010 – API integration tests
Create an integration test file `tests/integration/apiFlows.spec.ts` using supertest that:

- spins up the Express app,
- creates a barber and working hours,
- creates a service,
- creates a client,
- lists availability and creates an appointment,
- cancels an appointment and marks another as concluded.

Return only the TypeScript code for this integration test.

TASK-QA-011 – Frontend E2E tests
Assuming Playwright or Cypress is installed for the frontend, outline E2E tests that:

- cover the full client booking flow,
- cover the barber viewing and updating the agenda.

Return the test file in either Playwright (TypeScript) or Cypress syntax, focusing on test steps rather than implementation details of selectors.

PHASE 10 – Deployment and Delivery
TASK-OPS-001 – Backend Dockerfile
Create a Dockerfile for the Node.js backend that:

- uses a Node 18+ base image,
- installs dependencies,
- builds the TypeScript project,
- runs `npm run start` in production.

Optimize for small final image (multi-stage build if you want). Return only the Dockerfile.

TASK-OPS-002 – docker-compose for backend + Postgres
Create a `docker-compose.yml` that:

- defines a service for the backend container,
- defines a service for PostgreSQL with a named volume,
- sets environment variables including DATABASE_URL for the backend.

Return only the docker-compose.yml.

TASK-OPS-003 – .env.example for production
Generate a `.env.example` file for production with variables:

- DATABASE_URL
- PORT
- NODE_ENV

Return only the file contents.

TASK-OPS-004 – Simple CI pipeline
Provide a GitHub Actions workflow file `.github/workflows/ci.yml` that:

- runs on pushes and pull requests,
- installs dependencies,
- runs tests,
- builds the project.

Return only the YAML workflow.

TASK-OPS-010 – Frontend build script
Update the React frontend's package.json to include:

- a "build" script that builds the app for production,
- a "preview" or "serve" script if using Vite.

Return only the "scripts" section of package.json.

TASK-OPS-011 – Frontend hosting instructions
Explain, in 5–7 bullet points, how to deploy the built React frontend (from `npm run build`) to a static hosting provider (e.g., Netlify, Vercel, or static S3 hosting).

Keep it high-level, step-by-step, no marketing.

TASK-OPS-012 – Frontend env for API base URL
Show how to configure an environment variable in the frontend (Vite style: `VITE_API_URL`) and how to use it in the `api.ts` HTTP client to define the baseURL.

Return the relevant `.env.example` snippet and the updated `api.ts` code.

TASK-OPS-020 – Manual acceptance test: client flow
Define a manual test checklist that a human tester can follow to verify:

- a client can choose barber, service, date and slot,
- create an appointment successfully,
- gets blocked when they reach the no-show limit.

Return the checklist as numbered steps.

TASK-OPS-021 – Manual acceptance test: barber agenda
Define a manual test checklist to verify that a barber can:

- view the day agenda,
- mark each appointment as CONCLUIDO, CANCELADO_CLIENTE, CANCELADO_BARBEIRO, or FALTA.

Return the steps as a numbered list.

TASK-OPS-022 – Manual acceptance test: blocking behavior
Define a manual test scenario that:

- creates a client,
- schedules and marks multiple no-shows for that client,
- confirms that after reaching the configured limit, the client cannot create new appointments.

Return the scenario in clear steps with expected results.
