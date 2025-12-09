import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const directUrl = process.env.DIRECT_DATABASE_URL;
const runtimeUrl = process.env.DATABASE_URL;
const datasourceUrl = directUrl ?? runtimeUrl;

if (!datasourceUrl) {
  throw new Error('DATABASE_URL is not defined for PrismaClient');
}

const prismaClient = () => {
  // Prefer conexão direta quando disponível (evita erros de API key no Data Proxy)
  if (!datasourceUrl.startsWith('prisma+')) {
    const pool = new Pool({ connectionString: datasourceUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }

  // Fallback para Data Proxy / Accelerate quando usar prisma+postgres
  return new PrismaClient({ accelerateUrl: datasourceUrl });
};

export const prisma = prismaClient();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
