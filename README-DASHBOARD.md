# LOGOS CRM — Dashboard Administrativo

Painel completo de captura e gerenciamento de leads da LOGOS Framework.

## Acesso

| Rota | Descrição |
|---|---|
| `/` | Site institucional (marketing) |
| `/login` | Autenticação |
| `/dashboard` | Painel administrativo |

## Pré-requisitos

1. PostgreSQL rodando (ex.: container Docker)
2. Aplique o schema e crie o admin:

```bash
npm run db:seed
```

O script aplica `db/migrations/001_initial_schema.sql` e cria o usuário admin.

3. Configure `.env.local` (copie de `.env.example`):

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/logos_crm
AUTH_SECRET=
AUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@logos.dev
ADMIN_PASSWORD=

RESEND_API_KEY=
CONTACT_EMAIL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

## Como rodar localmente

```bash
npm install
npm run db:seed
npm run dev
```

- Site: http://localhost:3000
- Login: http://localhost:3000/login
- Dashboard: http://localhost:3000/dashboard

## Como criar usuários

O seed cria o primeiro admin com `ADMIN_EMAIL` e `ADMIN_PASSWORD`.

Para novos usuários, insira em `users` (senha com bcrypt) e crie o perfil em `profiles` vinculado ao mesmo `id`.

## Módulos

| Módulo | Rota | Funcionalidades |
|---|---|---|
| Dashboard | `/dashboard` | Métricas, gráficos, últimos contatos |
| Leads | `/dashboard/leads` | Tabela, pipeline DnD, export CSV/Excel |
| Lead detalhe | `/dashboard/leads/[id]` | Timeline, notas, ações |
| Agenda | `/dashboard/agenda` | Calendário mensal/semanal/diário |
| Projetos | `/dashboard/projetos` | Lista de projetos |
| Clientes | `/dashboard/clientes` | Conversão de leads |
| Propostas | `/dashboard/propostas` | CRUD, PDF, duplicar |
| Configurações | `/dashboard/configuracoes` | Branding e integrações |
| Perfil | `/dashboard/perfil` | Dados e senha |

## Arquitetura

```
src/
├── app/
│   ├── (marketing)/          # Site institucional
│   ├── dashboard/            # Rotas do CRM
│   ├── login/
│   └── api/dashboard/        # API REST autenticada
├── components/dashboard/     # UI do CRM
├── repositories/             # Acesso a dados (Drizzle ORM)
├── services/                 # Lógica de negócio
├── hooks/                    # React Query hooks
├── types/                    # TypeScript
├── lib/db/                   # Schema e cliente PostgreSQL
└── lib/auth-options.ts        # NextAuth (credenciais + JWT)
```

## Segurança

- **Middleware** protege `/dashboard/*` — redireciona para `/login`
- **Auth.js** com sessão JWT e senhas bcrypt
- **Autorização** nas rotas API via `requireAuth()`
- Validação Zod na API de contato
- Rate limit no formulário público

## Deploy na Vercel

1. Push para GitHub
2. Importe na Vercel
3. Adicione todas as variáveis de ambiente (incluindo `DATABASE_URL` apontando para Postgres acessível)
4. Execute `npm run db:seed` no ambiente de produção (ou aplique migrations manualmente)

## Scripts de banco

| Comando | Descrição |
|---|---|
| `npm run db:push` | Sincroniza schema Drizzle com o banco |
| `npm run db:migrate` | Aplica migrations Drizzle Kit |
| `npm run db:seed` | Aplica SQL inicial + cria admin |

## Como adicionar novos módulos

1. Atualize `src/lib/db/schema.ts` e gere migration se necessário
2. Adicione tipos em `src/types/`
3. Crie repository em `src/repositories/`
4. Crie API route em `src/app/api/dashboard/`
5. Crie componente em `src/components/dashboard/`
6. Adicione rota em `src/app/dashboard/`
7. Registre no menu em `src/config/dashboard.ts`
