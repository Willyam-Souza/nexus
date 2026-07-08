# Nexus — Task Manager

Gestor de tarefas full-stack com autenticação, categorias e quadro kanban.

- **`web/`** — frontend em React 19 + Vite + Tailwind CSS. Ver [web/README.md](web/README.md).
- **`api/`** — backend em Spring Boot 4 (Java 21) com autenticação JWT e Postgres (Supabase).

## Desenvolvimento local

```bash
# Backend (porta 8080)
cd api
cp src/main/resources/application.properties.example src/main/resources/application.properties
# preencha as credenciais reais no ficheiro copiado
./mvnw spring-boot:run

# Frontend (porta 5173)
cd web
cp .env.example .env
npm install
npm run dev
```
