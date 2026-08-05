# Bellas Nail Designer — Site de Agendamento

Site de agendamento para a Esmalteria Bellas Nail Designer: landing page com galeria de trabalhos,
fluxo de agendamento sem necessidade de conta (nome + telefone) e painel administrativo para a dona
gerenciar serviços, horários de funcionamento e os agendamentos recebidos.

- **Backend:** Django + Django REST Framework + SimpleJWT, SQLite
- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion

## Estrutura

```
backend/    # API Django (serviços, agendamentos, disponibilidade, login admin)
frontend/   # Site Next.js (landing, /agendar, /dashboard)
originais/  # Logo e fotos originais enviadas (backup)
```

## Rodando o backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env        # ajuste se necessário
python manage.py migrate
python manage.py runserver 8000
```

Um usuário administrador já foi criado para a dona acessar o painel:

- **Usuário:** `admin`
- **Senha:** `BellasNail@2026`

> Recomenda-se trocar essa senha após o primeiro acesso (`python manage.py changepassword admin`).

## Rodando o frontend

```bash
cd frontend
npm install
copy .env.example .env.local  # já vem com a URL do backend local
npm run dev
```

Acesse `http://localhost:3000`. O painel administrativo fica em `http://localhost:3000/dashboard`.

## Principais rotas

| Rota                    | Descrição                                      |
|--------------------------|------------------------------------------------|
| `/`                      | Landing page (hero, galeria, serviços)         |
| `/agendar`                | Fluxo de agendamento do cliente                |
| `/dashboard/login`        | Login da administradora                        |
| `/dashboard`               | Lista de agendamentos (confirmar/cancelar)     |
| `/dashboard/servicos`      | Cadastro de serviços                           |
| `/dashboard/horarios`      | Horário de funcionamento e bloqueios de data   |

## API (backend)

| Rota                              | Acesso   | Descrição                          |
|------------------------------------|----------|-------------------------------------|
| `GET /api/servicos/`               | público  | Lista de serviços ativos           |
| `GET /api/disponibilidade/`        | público  | Horários livres para um dia/serviço |
| `POST /api/agendamentos/`          | público  | Cria um agendamento                |
| `POST /api/auth/login/`            | público  | Login (retorna JWT)                |
| `GET/PATCH /api/agendamentos/`     | admin    | Listar/confirmar/cancelar          |
| CRUD `/api/servicos/`              | admin    | Gerenciar serviços                 |
| CRUD `/api/horarios-funcionamento/`| admin    | Gerenciar horário de funcionamento |
| CRUD `/api/bloqueios/`             | admin    | Gerenciar folgas/feriados          |
