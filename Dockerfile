# Stage 1: deps + build
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

# Generate Prisma client and build
RUN npm run prisma:generate && npm run build

# Stage 2: production image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3333
CMD ["node", "-r", "tsconfig-paths/register", "dist/main/server.js"]
