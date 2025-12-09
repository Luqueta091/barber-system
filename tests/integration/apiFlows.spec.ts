/**
 * Integration flow tests (requires database + Prisma).
 * Note: This suite is skipped by default to avoid failures when the DB is unavailable.
 */

import request from 'supertest';
import dotenv from 'dotenv';

// Load env and force direct DB for integration to avoid Data Proxy issues
dotenv.config();
if (process.env.DIRECT_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_DATABASE_URL;
}

const tomorrowAt = (hour: number, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(hour, minute, 0, 0);
  return d;
};

const expectStatus = (res: request.Response, expected: number) => {
  if (res.status !== expected) {
    // eslint-disable-next-line no-console
    console.error('Unexpected response', res.status, res.body);
  }
  expect(res.status).toBe(expected);
};

process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled rejection in integration test', reason);
});

describe('API flows (integration)', () => {
  afterAll(async () => {
    const { prisma } = await import('@/shared/infra/database/prismaClient');
    await prisma.$disconnect();
  });

  it('should run basic flow: create barber, service, client, availability, appointment lifecycle', async () => {
    try {
      const { app } = await import('@/main/app');
      const baseInicio = tomorrowAt(10, 0);
      const baseFim = tomorrowAt(12, 0);

      // create barber
      const barberRes = await request(app)
        .post('/barbeiros')
        .send({
          nome: 'Barber 1',
          telefone: `9999-${Date.now()}`,
        });
      expectStatus(barberRes, 201);
      const barbeiroId = barberRes.body.id;

      // configure working hours
      const horarioRes = await request(app)
        .post(`/barbeiros/${barbeiroId}/horarios`)
        .send({
          diaSemana: baseInicio.getDay(),
          horaInicio: baseInicio.toISOString(),
          horaFim: baseFim.toISOString(),
        });
      expectStatus(horarioRes, 200);

      // create service
      const servicoRes = await request(app)
        .post('/servicos')
        .send({
          nome: `Corte ${Date.now()}`,
          duracaoMinutos: 30,
          preco: 50,
        });
      expectStatus(servicoRes, 201);
      const servicoId = servicoRes.body.id;

      // create client
      const clienteRes = await request(app)
        .post('/clientes')
        .send({
          nome: 'Cliente',
          telefone: `1111-${Date.now()}`,
        });
      expectStatus(clienteRes, 201);
      const clienteId = clienteRes.body.id;

      // list disponibilidade
      const disponibilidadeRes = await request(app)
        .get('/disponibilidade')
        .query({
          barbeiroId,
          servicoId,
          data: baseInicio.toISOString(),
        });
      expectStatus(disponibilidadeRes, 200);

      // create appointment (if slots exist)
      if (disponibilidadeRes.body.length > 0) {
        const { inicio } = disponibilidadeRes.body[0];
        const agendamentoRes = await request(app)
          .post('/agendamentos')
          .send({
            clienteId,
            barbeiroId,
            servicoId,
            dataHoraInicio: inicio,
            origem: 'cliente',
          });
        expectStatus(agendamentoRes, 201);
        const agendamentoId = agendamentoRes.body.id;

        // conclude
        const concluirRes = await request(app)
          .post(`/agendamentos/${agendamentoId}/concluir`)
          .send({ barbeiroId });
        expectStatus(concluirRes, 200);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Integration test error:', error);
      throw error;
    }
  });
});
