import dotenv from 'dotenv';
import request from 'supertest';
import { prisma } from '@/shared/infra/database/prismaClient';

dotenv.config();

// Use direct DB for tests when available
if (process.env.DIRECT_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_DATABASE_URL;
}

const tomorrowAt = (hour: number, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(hour, minute, 0, 0);
  return d;
};

describe('API endpoints (integration)', () => {
  beforeAll(async () => {
    const { app } = await import('@/main/app');
    // Ensure routes are loaded; supertest will re-import app inside tests
    void app;
  });

  beforeEach(async () => {
    // Clear data between tests
    await prisma.agendamento.deleteMany({});
    await prisma.horarioTrabalho.deleteMany({});
    await prisma.servico.deleteMany({});
    await prisma.cliente.deleteMany({});
    await prisma.barbeiro.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('flows through clientes, barbeiros, servicos, disponibilidade e agendamentos', async () => {
    const { app } = await import('@/main/app');
    const baseInicio = tomorrowAt(10, 0);
    const baseFim = tomorrowAt(12, 0);

    // Cliente
    const clienteRes = await request(app).post('/clientes').send({
      nome: 'Cliente Teste',
      telefone: `11999${Date.now()}`,
    });
    expect(clienteRes.status).toBe(201);
    const clienteId = clienteRes.body.id;

    // Barbeiro
    const barbeiroRes = await request(app).post('/barbeiros').send({
      nome: 'Barbeiro Teste',
      telefone: `11988${Date.now()}`,
    });
    expect(barbeiroRes.status).toBe(201);
    const barbeiroId = barbeiroRes.body.id;

    // Horário de trabalho
    const horarioRes = await request(app)
      .post(`/barbeiros/${barbeiroId}/horarios`)
      .send({
        diaSemana: baseInicio.getDay(),
        horaInicio: baseInicio.toISOString(),
        horaFim: baseFim.toISOString(),
      });
    expect(horarioRes.status).toBe(200);

    // Serviço
    const servicoRes = await request(app).post('/servicos').send({
      nome: 'Corte',
      duracaoMinutos: 30,
      preco: 50,
    });
    expect(servicoRes.status).toBe(201);
    const servicoId = servicoRes.body.id;

    // Disponibilidade
    const disponibilidadeRes = await request(app)
      .get('/disponibilidade')
      .query({
        barbeiroId,
        servicoId,
        data: baseInicio.toISOString(),
      });
    expect(disponibilidadeRes.status).toBe(200);
    expect(Array.isArray(disponibilidadeRes.body)).toBe(true);
    expect(disponibilidadeRes.body.length).toBeGreaterThan(0);

    const slot = disponibilidadeRes.body[0];

    // Criar agendamento
    const agendamentoRes = await request(app).post('/agendamentos').send({
      clienteId,
      barbeiroId,
      servicoId,
      dataHoraInicio: slot.inicio,
      origem: 'cliente',
    });
    expect(agendamentoRes.status).toBe(201);
    const agendamentoId = agendamentoRes.body.id;

    // Concluir agendamento
    const concluirRes = await request(app)
      .post(`/agendamentos/${agendamentoId}/concluir`)
      .send({ barbeiroId });
    expect(concluirRes.status).toBe(200);
    expect(concluirRes.body.status).toBe('CONCLUIDO');
  });
});
