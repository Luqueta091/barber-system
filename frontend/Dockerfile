# Build stage: compila o frontend Vite
FROM node:20-alpine AS build
WORKDIR /app
# copia somente os manifests do frontend para evitar pegar o package.json do backend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend .
# Permite injetar a URL do backend na build (pode ser sobrescrita via arg)
ARG VITE_API_URL=https://barber-system-production.up.railway.app
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Runtime stage: serve os arquivos estáticos com Nginx
FROM nginx:alpine
ENV PORT=80
# Usa template para escutar na porta $PORT e habilitar SPA fallback
COPY frontend/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
