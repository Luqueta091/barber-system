import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
