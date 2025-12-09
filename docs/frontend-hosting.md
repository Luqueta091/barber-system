# Frontend Hosting (Vite build)

- Build o app: `cd frontend && npm install && npm run build` (gera `frontend/dist`).
- Escolha um host estático (Netlify, Vercel, S3+CloudFront, etc.).
- Configure variáveis: `VITE_API_URL` apontando para a URL pública do backend.
- Faça o deploy da pasta `frontend/dist` como site estático (upload ou CLI do provedor).
- Se usar rotas do React Router, habilite fallback para `index.html` (rewrite).
- Após publicar, valide chamadas à API no ambiente hospedado (CORS e baseURL corretos).
