import { Router } from 'express';

const router = Router();

router.get('/clientes', (_req, res) => {
  res.status(200).json({ message: 'clientes placeholder' });
});

router.get('/barbeiros', (_req, res) => {
  res.status(200).json({ message: 'barbeiros placeholder' });
});

router.get('/servicos', (_req, res) => {
  res.status(200).json({ message: 'servicos placeholder' });
});

router.get('/agendamentos', (_req, res) => {
  res.status(200).json({ message: 'agendamentos placeholder' });
});

export default router;
