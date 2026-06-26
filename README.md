<div style="text-align: center;">
  <img src="frontend/public/logo.png" alt="Taky logo" width="80" height="80" />
</div>

# Taky - Sistema de Gerenciamento de Tarefas

Taky é um aplicativo de gerenciamento de tarefas construído com FastAPI + React (TanStack Start). Possui quadro Kanban com drag-and-drop, visão em calendário, gerenciamento de equipes e analytics para administradores.

## Funcionalidades

### Quadro Kanban
- Arraste tarefas entre colunas (A Fazer, Em Andamento, Bloqueado, Concluído) usando @dnd-kit
- Níveis de prioridade (Baixa/Média/Alta) e tags personalizadas
- Modal de tarefa com abas: detalhes, comentários, histórico e anexos

### Calendário
- Visualização de prazos no calendário
- Destaca dias com tarefas de alta prioridade

### Analytics (Admin)
- Dashboard com KPIs (total de tarefas, horas gastas, bloqueadas)
- Gráficos de pizza e barras via Recharts
- Gerenciamento de membros com controle de acesso por função

### Gerenciamento de Equipes
- Seleção de perfil no cadastro — usuário escolhe Admin ou Membro (com ícones)
- Primeiro usuário sempre é admin; cadastro de admin posterior é bloqueado se já existir um
- No primeiro login, membros escolhem uma equipe para integrar; admins criam sua primeira equipe
- Cada usuário pertence a uma equipe via `team_id` no model User
- Sistema de comentários e histórico de atividades em cada tarefa

### Anexos
- Upload/download de arquivos (.pdf, .csv, .xlsx, .docx, .json, imagens, .txt, .zip)
- Armazenamento no servidor com validação de tamanho e extensão

## Tecnologias

- **Frontend**: React 19, TanStack Router, Vite, Zustand, TailwindCSS, Recharts, Lucide Icons, @dnd-kit, Sonner
- **Backend**: FastAPI (Python), SQLAlchemy, MySQL (PyMySQL), JWT (python-jose), passlib
- **Design**: Interface glassmorphism com variáveis CSS personalizadas

## Como Começar

### 1. Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate

pip install fastapi uvicorn sqlalchemy pymysql python-multipart python-jose passlib cryptography python-dotenv

# Configurar .env:
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

O frontend roda em `http://localhost:5173` e faz requisições para o backend na porta 8000.

## Permissões

- **Admin**: Criar equipes, gerenciar membros, ver analytics, excluir tarefas
- **Membro**: Visualizar e gerenciar tarefas atribuídas, adicionar comentários, enviar arquivos

## Visão Geral da API

| Endpoint | Método | Autenticação | Descrição |
|---|---|---|---|
| `/auth/register` | POST | — | Cadastrar usuário (admin/member) |
| `/auth/me` | GET | Usuário | Perfil do usuário logado |
| `/teams` | GET | — | Listar equipes |
| `/teams` | POST | Admin | Criar equipe |
| `/teams/{id}/join` | POST | Usuário | Entrar em uma equipe |
| `/members` | GET | — | Listar membros |
| `/members/{id}` | DELETE | Admin | Remover membro (limpa registros vinculados) |
| `/tasks` | GET/POST | Usuário/Admin  | Listar / criar tarefas |
| `/tasks/{id}` | PUT/DELETE | Usuário/Admin | Atualizar / excluir tarefa |
| `/tasks/{id}/comments` | POST | Usuário | Adicionar comentário |

\* `GET /tasks` não requer autenticação; `POST`/`PUT` exigem login.
