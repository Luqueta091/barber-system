import { Router } from 'express';
import { ClienteController } from '../modules/clientes/interface/http/ClienteController';
import { BarbeiroController } from '../modules/barbeiros/interface/http/BarbeiroController';
import { ServicoController } from '../modules/servicos/interface/http/ServicoController';
import { AgendamentoController } from '../modules/agendamentos/interface/http/AgendamentoController';
import { fakeAuth } from '../shared/auth/middleware';

const router = Router();
const clienteController = new ClienteController();
const barbeiroController = new BarbeiroController();
const servicoController = new ServicoController();
const agendamentoController = new AgendamentoController();

router.post('/clientes', (req, res) => clienteController.create(req, res));
router.put('/clientes/:id', (req, res) => clienteController.update(req, res));
router.post('/clientes/:id/desbloquear', (req, res) =>
  clienteController.desbloquear(req, res),
);
router.post('/clientes/login', (req, res) => clienteController.login(req, res));

router.get('/barbeiros', (req, res) => barbeiroController.list(req, res));
router.post('/barbeiros', (req, res) => barbeiroController.create(req, res));
router.put('/barbeiros/:id', (req, res) => barbeiroController.update(req, res));
router.patch('/barbeiros/:id/status', (req, res) => barbeiroController.updateStatus(req, res));
router.get('/barbeiros/:id/horarios', (req, res) => barbeiroController.listHorarios(req, res));
router.post('/barbeiros/:id/horarios', (req, res) =>
  barbeiroController.configurarHorario(req, res),
);

router.post('/servicos', (req, res) => servicoController.create(req, res));
router.put('/servicos/:id', (req, res) => servicoController.update(req, res));
router.patch('/servicos/:id/status', (req, res) => servicoController.updateStatus(req, res));
router.get('/servicos', (req, res) => servicoController.listActive(req, res));

router.get('/disponibilidade', (req, res) =>
  agendamentoController.listarDisponibilidade(req, res),
);
router.post('/agendamentos', (req, res) => agendamentoController.criar(req, res));
router.delete('/agendamentos/:id', (req, res) => agendamentoController.cancelarCliente(req, res));
router.delete('/agendamentos/:id/barbeiro', fakeAuth, (req, res) =>
  agendamentoController.cancelarBarbeiro(req, res),
);
router.delete('/agendamentos/:id/apagar', fakeAuth, (req, res) =>
  agendamentoController.apagar(req, res),
);
router.post('/agendamentos/:id/concluir', fakeAuth, (req, res) =>
  agendamentoController.concluir(req, res),
);
router.post('/agendamentos/:id/falta', fakeAuth, (req, res) =>
  agendamentoController.marcarFalta(req, res),
);
router.get('/barbeiros/:id/agenda', fakeAuth, (req, res) =>
  agendamentoController.agendaDoDia(req, res),
);
router.get('/clientes/:id/agendamentos', (req, res) =>
  agendamentoController.listarDoCliente(req, res),
);

router.get('/agendamentos', (_req, res) => {
  res.status(200).json({ message: 'agendamentos endpoint' });
});

router.get('/', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;
