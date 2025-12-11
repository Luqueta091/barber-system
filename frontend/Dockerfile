# Build stage: compila o frontend Vite
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Permite injetar a URL do backend na build (pode sobrescrever no deploy)
ARG VITE_API_URL=https://barber-system-production.up.railway.app
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Runtime stage: serve os arquivos estáticos com Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
