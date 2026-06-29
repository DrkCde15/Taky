<p align="center">
  <img src="frontend/public/logo.png" alt="Taky logo" width="80" height="80">
</p>

# Taky - Sistema de Gerenciamento de Tarefas

Taky é um aplicativo de gerenciamento de tarefas com quadro Kanban drag-and-drop, visão em calendário, gerenciamento de equipes, analytics para administradores, notificações em tempo real e suporte a comentários, anexos e registro de horas.

**Stack:** FastAPI (Python) + React 19 (TanStack Start) + MySQL

---

## Funcionalidades

### Quadro Kanban
- Arraste tarefas entre colunas (A Fazer, Em Andamento, Bloqueado, Concluído) via `@dnd-kit`
- Níveis de prioridade (Baixa/Média/Alta) com cores distintas e tags personalizadas
- Modal de edição com abas: detalhes (com editor markdown), comentários, histórico de alterações e anexos
- Criação rápida de tarefas diretamente do navbar

### Calendário
- Visualização de prazos no calendário mensal
- Dias com tarefas destacados por prioridade (alta em vermelho)
- Lista de tarefas ao selecionar um dia

### Analytics (Admin)
- Dashboard com KPIs: total de tarefas, horas gastas, tarefas bloqueadas
- Gráficos de pizza (distribuição por status) e barras (tarefas por membro) via Recharts
- Filtro por período e visão por membro da equipe

### Gerenciamento de Equipes
- Cadastro com seleção de perfil — Admin ou Membro
- Primeiro usuário sempre é admin; apenas um admin por sistema
- Membros sem equipe veem um modal de seleção ao entrar; admins criam a primeira equipe
- Usuários podem pertencer a múltiplas equipes via tabela associativa `TeamMember`
- Gerenciamento de membros com remoção e transferência de tarefas

### Notificações
- Notificações automáticas ao ser atribuído a uma tarefa, ao ter status alterado ou ao receber comentário
- Sino no navbar com contador de não lidas
- Dropdown com lista de notificações e ação de marcar como lida
- Polling automático a cada 60s

### Comentários e Histórico
- Comentários com suporte a markdown em cada tarefa
- Histórico detalhado de todas as alterações (status, prioridade, criação)
- Linha do tempo com usuário, ação e timestamp

### Anexos
- Upload/download de arquivos: `.pdf`, `.csv`, `.xlsx`, `.docx`, `.json`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.txt`, `.zip`
- Validação de tamanho (máx. 10MB) e extensão
- Nomes sanitizados e armazenamento seguro no servidor

### Registro de Horas
- Apontamento de horas gastas por tarefa
- Histórico de time logs com descrição

### Subtarefas
- Suporte a tarefas pai/filho (auto-relacionamento no modelo `Task`)
- Estrutura hierárquica para decomposição de tarefas complexas

### Tempo Real
- WebSocket por projeto para atualizações ao vivo
- Eventos: `TASK_CREATED`, `TASK_UPDATED`
- Reconexão automática com backoff exponencial

---

## Tecnologias

### Frontend
| Categoria | Tecnologia |
|-----------|-----------|
| Framework | React 19, TanStack Start (file-based routing + SSR) |
| Linguagem | TypeScript |
| Build | Vite 8, Nitro (Cloudflare) |
| Estado | Zustand 5 (auth + tasks), TanStack Query (server state) |
| Estilos | Tailwind CSS 4 + shadcn/ui (New York) + glassmorphism |
| Ícones | Lucide |
| Drag-and-drop | @dnd-kit |
| Gráficos | Recharts |
| Calendário | react-calendar |
| Editor | @uiw/react-md-editor |
| Formulários | react-hook-form + zod |
| Toast | Sonner |
| HTTP | Axios (com refresh automático de token) |
| WebSocket | Cliente próprio com reconexão |

### Backend
| Categoria | Tecnologia |
|-----------|-----------|
| Framework | FastAPI (Python) |
| ORM | SQLAlchemy 2.0 |
| Banco | MySQL (PyMySQL) |
| Autenticação | JWT (python-jose) com access + refresh tokens |
| Senhas | passlib (pbkdf2_sha256) |
| Validação | Pydantic v2 |
| WebSocket | Starlette WebSocket nativo |
| Upload | Validação de tipo/tamanho + sanitização |
| CORS | Configurável via `ALLOWED_ORIGINS` |

---

## API - Visão Geral

### Autenticação

| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| POST | `/auth/register` | — | Cadastrar usuário (role: admin/member). Primeiro user vira admin |
| POST | `/auth/token` | — (form) | Login (username=email, password). Retorna JWT + refresh + user |
| POST | `/auth/refresh` | — | Renovar access token usando refresh token |
| GET | `/auth/me` | `Bearer` | Perfil do usuário logado (com `team_memberships`) |
| PUT | `/auth/me` | `Bearer` | Atualizar nome/email/avatar |
| POST | `/auth/invite` | `Admin` | Criar token de convite (válido por 7 dias) |
| POST | `/auth/invite/validate` | — | Validar token de convite |

### Equipes

| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| GET | `/teams` | — | Listar todas as equipes |
| POST | `/teams` | `Bearer` (admin) | Criar equipe. Criador vira admin da equipe |
| POST | `/teams/{id}/join` | `Bearer` | Entrar em uma equipe como member |

### Projetos

| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| GET | `/projects/team/{team_id}` | `Bearer` | Listar projetos de uma equipe |
| POST | `/projects` | `Bearer` | Criar projeto em uma equipe |

### Tarefas

| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| GET | `/tasks?project_id=` | — | Listar tarefas de um projeto (inclui comentários, arquivos, histórico, time logs, subtarefas) |
| POST | `/tasks` | `Bearer` | Criar tarefa |
| PUT | `/tasks/{id}` | `Bearer` | Atualizar tarefa (status, prioridade, assignee, etc.) |
| DELETE | `/tasks/{id}` | `Admin` | Excluir tarefa |
| POST | `/tasks/{id}/comments` | `Bearer` | Adicionar comentário |
| POST | `/tasks/{id}/files` | `Bearer` | Upload de arquivo (multipart) |
| GET | `/tasks/files/{file_id}` | `Bearer` | Download de arquivo |
| POST | `/tasks/{id}/timelogs` | `Bearer` | Registrar horas na tarefa |
| GET | `/tasks/{id}/timelogs` | `Bearer` | Listar registros de horas |

### Membros

| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| GET | `/members` | — | Listar todos os usuários |
| DELETE | `/members/{id}` | `Admin` | Remover membro (reassinala tarefas para null, apaga comentários/histórico) |

### Notificações

| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| GET | `/notifications` | `Bearer` | Listar notificações do usuário |
| GET | `/notifications/unread-count` | `Bearer` | Contagem de não lidas |
| PATCH | `/notifications/{id}/read` | `Bearer` | Marcar como lida |
| POST | `/notifications/read-all` | `Bearer` | Marcar todas como lidas |

### WebSocket

| Conexão | Descrição |
|---------|-----------|
| `ws://localhost:8000/ws/projects/{project_id}` | Receber atualizações ao vivo do projeto (TASK_CREATED, TASK_UPDATED) |

---

## Permissões

| Papel | Acesso |
|-------|--------|
| **Admin (sistema)** | Criar equipes, gerenciar membros (remover), ver analytics, excluir qualquer tarefa, criar invites |
| **Membro** | Visualizar e gerenciar tarefas atribuídas, adicionar comentários, enviar arquivos, registrar horas |
| **Team Admin** | (via `TeamMember.role`) Controle adicional dentro da equipe |
| **Sem equipe** | Modal de onboarding: admin cria equipe, member seleciona uma para entrar |

---

## Como Começar

### 1. Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate

pip install -r requirements.txt

# Configure o .env (copie de .env.example):
# MYSQL_USER=root
# MYSQL_PASSWORD=sua_senha
# MYSQL_DATABASE=Taky_db
# SECRET_KEY=sua_chave_secreta

uvicorn main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend roda em `http://localhost:5173` e faz requisições para o backend em `http://localhost:8000`.

### 3. Build de Produção (Frontend)

```bash
cd frontend
npm run build
npm run preview
```

---

## Deploy (GitHub Pages)

O frontend pode ser publicado no **GitHub Pages** via GitHub Actions.

### Pré-requisitos

1. O repositório deve estar no GitHub (público ou privado com GitHub Pages habilitado).
2. Nas configurações do repositório, vá em **Settings > Pages** e selecione **GitHub Actions** como origem.

### Como funciona

- O workflow em `.github/workflows/deploy.yml` é acionado automaticamente em pushes para `main` que alterem arquivos em `frontend/`.
- O build gera os assets em `dist/` (HTML, JS, CSS) — sem SSR, apenas cliente.
- O workflow copia `index.html` como `404.html` — o GitHub Pages serve esse arquivo para qualquer rota desconhecida, permitindo que o roteador client-side (TanStack Router) assuma o controle.
- O artifact é enviado ao GitHub Pages via `actions/deploy-pages`.

### Build manual (comprovante local)

```bash
cd frontend
$env:VITE_BASE_PATH="/nome-do-repositorio/"
npx vite build --base="/nome-do-repositorio/"
```

> O `--base` deve corresponder ao subpath do GitHub Pages. Para `username.github.io/repo`, use `--base=/repo/`. Para `username.github.io`, use `--base=/`.

### Variáveis de ambiente de build

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `VITE_BASE_PATH` | — | Base path para o roteador TanStack Router (ex: `/repo/`) |
| `VITE_API_URL` | `http://localhost:8000` | URL do backend |

> O workflow usa `actions/configure-pages` para detectar automaticamente o `base_path` correto.
> O `VITE_API_URL` não precisa ser alterado se o backend estiver rodando em `localhost:8000`.

### Rodar o site hospedado com backend local

Para que o GitHub Pages funcione com o backend rodando na sua máquina:

1. **CORS** — Adicione a URL do GitHub Pages no `ALLOWED_ORIGINS` do backend (`backend/.env`):
   ```dotenv
   ALLOWED_ORIGINS=http://localhost:5173,https://seu-usuario.github.io
   ```
2. **WebSocket** — A URL do WebSocket é derivada automaticamente do `VITE_API_URL` (padrão `http://localhost:8000` → `ws://localhost:8000`). Nenhuma configuração extra necessária.

> Se o backend for para a nuvem no futuro, basta definir `VITE_API_URL=https://seudominio.com` no build.

### Roteamento SPA

O deploy usa **single-page application (SPA)** fallback:

```
frontend/dist/
├── index.html            # App shell (entrada do SPA)
├── 404.html              # Cópia do index.html — GitHub Pages serve para rotas desconhecidas
├── assets/               # JS/CSS compilados
└── ...
```

Quando o usuário acessa `https://seu-usuario.github.io/repo/tarefas` diretamente:
1. GitHub Pages não encontra `tarefas/index.html` e serve `404.html`
2. O JavaScript carrega e o TanStack Router lê a URL `/repo/tarefas`
3. O roteador (com `basepath: /repo/`) extrai a rota `/tarefas` e renderiza a página correta

> Para site de usuário (`seu-usuario.github.io`), o `basepath` vira `/` e o comportamento é o mesmo.

---

## Variáveis de Ambiente (.env)

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `MYSQL_HOST` | `localhost` | Host do MySQL |
| `MYSQL_PORT` | `3306` | Porta do MySQL |
| `MYSQL_USER` | `root` | Usuário MySQL |
| `MYSQL_PASSWORD` | — | Senha MySQL |
| `MYSQL_DATABASE` | `taky_db` | Nome do banco |
| `SECRET_KEY` | `change_me_in_production` | Chave para assinar JWT |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Origens permitidas no CORS (separadas por vírgula). Inclua a URL do GitHub Pages se for usar o site hospedado com backend local |

> A senha deve ter no mínimo 8 caracteres, com ao menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.

---

## Estrutura do Projeto

```
Taky/
├── backend/
│   ├── core/          # Config, database, security, websocket
│   ├── models/        # SQLAlchemy models (User, Team, Task, etc.)
│   ├── routers/       # FastAPI route handlers (auth, teams, tasks, etc.)
│   ├── schemas/       # Pydantic schemas (request/response validation)
│   ├── services/      # Business logic layer
│   ├── utils/         # Validators (password, filename)
│   ├── uploads/       # File storage directory
│   └── main.py        # FastAPI app entry point
│
└── frontend/
    └── src/
        ├── routes/          # TanStack file-based routing
        ├── components/      # React components (Kanban, Modals, Navbar)
        │   ├── kanban/      # Column, TaskCard, ModalEditTask
        │   └── ui/          # shadcn/ui primitives
        ├── stores/          # Zustand stores (auth, tasks, notifications)
        ├── lib/             # Websocket, utilities, error handling
        └── utils/           # Axios API client
```
