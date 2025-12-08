import request from 'supertest';
import app from '../../src/main/app';

describe('API integration flows', () => {
  it('performs booking flow', async () => {
    const server = app.listen();
    const agent = request(server);

    await agent.post('/barbeiros').send({ nome: 'Carlos', telefone: '123', ativo: true });
    await agent.post('/barbeiros/horarios').send({ barbeiroId: '1', diaSemana: 1, horaInicio: '09:00', horaFim: '18:00' });
    await agent.post('/servicos').send({ nome: 'Corte', duracao: 30, preco: 50, ativo: true });
    await agent.post('/clientes').send({ nome: 'Cliente', telefone: '999', ativo: true });

    await agent.get('/barbeiros/1/disponibilidade?data=2024-01-01&servicoId=1');
    await agent.post('/agendamentos').send({ barbeiroId: '1', clienteId: '1', servicoId: '1', dataHoraInicio: '2024-01-01T10:00:00Z' });
    await agent.post('/agendamentos/2/cancelar').send({ motivo: 'cliente' });
    await agent.post('/agendamentos/3/concluir');

    server.close();
  });
});
