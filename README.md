# Bellas Nail Designer — Site de Agendamento

Site de agendamento para a Esmalteria Bellas Nail Designer: landing page com galeria de trabalhos,
fluxo de agendamento sem necessidade de conta (nome + telefone) e painel administrativo para a dona
gerenciar serviços, horários de funcionamento e os agendamentos recebidos.

- **Backend:** Django + Django REST Framework + SimpleJWT (SQLite local / PostgreSQL em produção)
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

Um usuário administrador já foi criado para a dona acessar o painel. As credenciais foram
entregues a ela por um canal privado (não ficam no README por segurança).

> Se você é desenvolvedor(a) clonando este projeto, crie seu próprio usuário de teste com
> `python manage.py createsuperuser`.

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

## Deploy (Railway + Vercel)

Repositório: https://github.com/codebyhelys/BellasNailsEsmalteria (monorepo — `backend/` e `frontend/`).

### 1. Backend no Railway

1. Crie um projeto novo no Railway → **Deploy from GitHub repo** → selecione este repositório.
2. Nas configurações do serviço, defina o **Root Directory** como `backend`.
3. Clique em **+ New** → **Database** → **PostgreSQL** dentro do mesmo projeto (o Railway injeta a variável `DATABASE_URL` automaticamente no serviço do backend).
4. Em **Variables** do serviço backend, adicione:
   ```
   SECRET_KEY=<gere uma chave nova, ex: python -c "import secrets; print(secrets.token_urlsafe(50))">
   DEBUG=False
   ALLOWED_HOSTS=<dominio-que-o-railway-gerar>.up.railway.app
   CSRF_TRUSTED_ORIGINS=https://<dominio-que-o-railway-gerar>.up.railway.app
   CORS_ALLOWED_ORIGINS=https://<dominio-que-a-vercel-gerar>.vercel.app
   SALON_WHATSAPP_NUMBER=5588999756175
   ```
   (O domínio do Railway só existe depois do primeiro deploy — pode colocar um valor provisório e ajustar depois.)
5. O Railway detecta o `Procfile` sozinho: roda `migrate` antes do deploy (processo `release`) e sobe com `gunicorn` (processo `web`).
6. Depois do primeiro deploy, crie o usuário admin em produção pela aba **Shell** do serviço (ou `railway run`):
   ```bash
   python manage.py createsuperuser
   ```

### 2. Frontend na Vercel

1. **Add New Project** na Vercel → importe o mesmo repositório.
2. Em **Root Directory**, selecione `frontend`.
3. Em **Environment Variables**, adicione:
   ```
   NEXT_PUBLIC_API_URL=https://<dominio-do-railway>.up.railway.app/api
   NEXT_PUBLIC_WHATSAPP_NUMBER=5588999756175
   NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/bellas.nailsesmalteria/
   ```
4. Deploy. A Vercel detecta Next.js automaticamente.

### 3. Fechando o ciclo

Depois que os dois estiverem no ar, volte no Railway e confirme que `CORS_ALLOWED_ORIGINS` e `CSRF_TRUSTED_ORIGINS` apontam para o domínio final da Vercel (com `https://`), e redeploy o backend se precisar ajustar.
