import cors from 'cors';
import express, { Express } from 'express';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app: Express = express();

app.use(
  cors({
    origin: '*',
  }),
);
app.use(express.json());

app.use('/', router);
app.use(errorHandler);

export { app };
