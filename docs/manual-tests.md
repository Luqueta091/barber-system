# Manual Acceptance Tests

## Client flow
1. Criar barbeiro e configurar horário de trabalho para o dia atual.
2. Criar serviço ativo com duração > 0.
3. Criar cliente não bloqueado.
4. Consultar `/disponibilidade` com barbeiro/serviço/data; verificar slots.
5. Criar agendamento em um slot disponível.
6. Repetir faltas até atingir limite e verificar bloqueio em novo agendamento.

## Agenda do barbeiro
1. Listar `/barbeiros/:id/agenda?data=YYYY-MM-DD`; verificar agendamentos ordenados por hora.
2. Marcar CONCLUIR (`POST /agendamentos/:id/concluir`); status deve mudar para CONCLUIDO.
3. Marcar FALTA (`POST /agendamentos/:id/falta`); status deve mudar para FALTA.
4. Cancelar pelo barbeiro (`DELETE /agendamentos/:id/barbeiro`); status deve mudar para CANCELADO_BARBEIRO.

## Bloqueio por faltas
1. Criar cliente e agendar 3 vezes.
2. Marcar as 3 como FALTA.
3. Verificar cliente bloqueado.
4. Tentar novo agendamento; deve falhar por bloqueio.
