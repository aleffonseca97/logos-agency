# LOGOS CRM — Dashboard Administrativo

Painel completo de captura e gerenciamento de leads da LOGOS Framework.

## Acesso

| Rota | Descrição |
|---|---|
| `/` | Site institucional (marketing) |
| `/login` | Autenticação |
| `/dashboard` | Painel administrativo |

## Pré-requisitos

1. Execute as migrations do Supabase:
   - `supabase/migrations/001_create_leads_table.sql`
   - `supabase/migrations/002_crm_schema.sql`

2. Configure `.env.local` (copie de `.env.local.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
CONTACT_EMAIL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

## Como rodar localmente

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Login: http://localhost:3000/login
- Dashboard: http://localhost:3000/dashboard

## Como criar usuários

1. Acesse o **Supabase Dashboard → Authentication → Users**
2. Clique em **Add user → Create new user**
3. Informe e-mail e senha
4. O trigger `handle_new_user` cria automaticamente o perfil em `profiles`
5. Faça login em `/login`

> Para produção, desative cadastro público em Authentication → Settings.

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
├── components/dashboard/       # UI do CRM
├── repositories/             # Acesso a dados (Supabase)
├── services/                 # Lógica de negócio
├── hooks/                    # React Query hooks
├── types/                    # TypeScript
└── lib/supabase/             # Clientes SSR/Browser/Admin
```

## Segurança

- **Middleware** protege `/dashboard/*` — redireciona para `/login`
- **RLS** no Supabase — usuários autenticados acessam dados via anon key
- **Service role** apenas server-side (formulário público + notificações)
- Validação Zod na API de contato
- Rate limit no formulário público

## Deploy na Vercel

1. Push para GitHub
2. Importe na Vercel
3. Adicione todas as variáveis de ambiente
4. Execute migrations no Supabase de produção
5. Crie usuário admin no Supabase Auth

## Como adicionar novos módulos

1. Crie migration SQL se precisar de nova tabela
2. Adicione tipos em `src/types/`
3. Crie repository em `src/repositories/`
4. Crie API route em `src/app/api/dashboard/`
5. Crie componente em `src/components/dashboard/`
6. Adicione rota em `src/app/dashboard/`
7. Registre no menu em `src/config/dashboard.ts`

## Como alterar permissões

Edite as policies RLS em `002_crm_schema.sql`:

```sql
-- Exemplo: apenas admins
create policy "Admins only" on public.leads
  for all to authenticated
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );
```

## Como escalar

- **Performance**: React Query cache, paginação server-side, lazy loading
- **Notificações**: expandir `notifications.repository.ts` com cron jobs
- **Google Calendar**: usar campo `google_calendar_id` em `events`
- **Equipe**: adicionar roles em `profiles.role`
- **Multi-tenant**: adicionar `org_id` nas tabelas

## Light / Dark Mode

Toggle no topbar do dashboard. Preferência salva em `localStorage` (`logos-theme`).

O site institucional permanece dark-first via design tokens.
