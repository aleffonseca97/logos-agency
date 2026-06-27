# Sistema de Captura de Leads — LOGOS Framework

Guia completo para configurar, testar e fazer deploy do formulário de contato.

## Visão geral

Quando um visitante envia o formulário:

1. Os dados são validados com **Zod**
2. O lead é salvo na tabela `leads` do **Supabase**
3. Um e-mail é enviado para a equipe via **Resend**
4. Um e-mail de confirmação é enviado ao cliente
5. A tela de sucesso é exibida com opções de WhatsApp e voltar ao início

---

## 1. Configurar o Supabase

### Criar o projeto

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Vá em **Project Settings → API** e copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (**nunca exponha no client**)

### Criar a tabela

No **SQL Editor** do Supabase, execute o arquivo:

```
supabase/migrations/001_create_leads_table.sql
```

Isso cria a tabela `leads` com os campos:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid | Identificador único |
| `created_at` | timestamptz | Data de criação |
| `name` | text | Nome do contato |
| `company` | text | Empresa |
| `email` | text | E-mail |
| `phone` | text | WhatsApp/telefone |
| `project_type` | text | Tipo de projeto |
| `budget` | text | Faixa de investimento |
| `message` | text | Mensagem |
| `status` | text | Padrão: `Novo` |
| `source` | text | Padrão: `website` |
| `ip` | text | IP do visitante (opcional) |
| `user_agent` | text | User-Agent (opcional) |

A tabela usa **RLS habilitado** sem policies públicas — apenas o `service_role` (server-side) pode inserir.

---

## 2. Configurar o Resend

1. Crie uma conta em [resend.com](https://resend.com)
2. Gere uma API Key em **API Keys**
3. Adicione ao `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxx
CONTACT_EMAIL=logosdev.agency@gmail.com
RESEND_FROM_EMAIL=LOGOS Framework <onboarding@resend.dev>
```

### Domínio de envio (produção)

Para produção, verifique seu domínio no Resend e atualize:

```env
RESEND_FROM_EMAIL=LOGOS Framework <contato@seudominio.com>
```

No sandbox, o Resend só envia para o e-mail da conta cadastrada.

---

## 3. Preencher o `.env.local`

Copie o template:

```bash
cp .env.local.example .env.local
```

Preencha todas as variáveis:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=LOGOS Framework <onboarding@resend.dev>
CONTACT_EMAIL=logosdev.agency@gmail.com

NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
WHATSAPP_NUMBER=5511999999999
```

> **Nota:** `NEXT_PUBLIC_WHATSAPP_NUMBER` é usado no botão do client. `WHATSAPP_NUMBER` é reservado para uso server-side.

---

## 4. Testar localmente

```bash
npm install
npm run dev
```

1. Acesse `http://localhost:3000`
2. Role até a seção **Contato**
3. Preencha o formulário com dados reais
4. Aguarde pelo menos 3 segundos antes de enviar (proteção anti-spam)
5. Verifique:
   - Toast de sucesso
   - Tela de confirmação
   - Registro na tabela `leads` do Supabase
   - E-mail na caixa `CONTACT_EMAIL`
   - E-mail de confirmação no endereço informado

### Testar validação

- Envie com campos vazios → mensagens de erro nos campos + toast
- Envie duas vezes com o mesmo e-mail em menos de 5 min → erro de duplicata
- Envie mais de 5 vezes em 15 min → rate limit (429)

---

## 5. Deploy na Vercel

1. Faça push do repositório para o GitHub
2. Importe o projeto na [Vercel](https://vercel.com)
3. Em **Settings → Environment Variables**, adicione todas as variáveis do `.env.local`
4. Deploy

Variáveis obrigatórias em produção:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_APP_URL` (URL do site em produção)
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

---

## 6. Alterar o e-mail de destino

Edite a variável de ambiente:

```env
CONTACT_EMAIL=novo-email@empresa.com
```

Ou altere o fallback em `src/lib/resend.ts` → `getContactEmail()`.

---

## 7. Alterar o WhatsApp

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=5511987654321
```

A mensagem padrão está em `src/config/contact.ts` → `getWhatsAppUrl()`.

---

## 8. Adicionar novos campos

### Passo a passo

1. **Supabase** — adicione a coluna na tabela `leads`
2. **`src/types/lead.ts`** — atualize o tipo `Lead`
3. **`src/lib/validators/contact.ts`** — adicione o campo no schema Zod
4. **`src/components/contact/types.ts`** — adicione ao `ContactFormData`
5. **`src/services/lead.service.ts`** — mapeie no `mapFormToLeadInsert`
6. **`src/lib/emails/templates.ts`** — inclua no template do e-mail da equipe
7. **`src/components/contact/contact-form.tsx`** — adicione o input no formulário

---

## Arquitetura

```
src/
├── app/api/contact/route.ts      # API Route (orquestração)
├── lib/
│   ├── supabase.ts               # Cliente admin Supabase
│   ├── resend.ts                 # Cliente Resend + config
│   ├── sanitize.ts               # Sanitização de inputs
│   ├── rate-limit.ts             # Rate limit por IP
│   ├── request-meta.ts           # IP e User-Agent
│   ├── validators/contact.ts     # Schema Zod
│   └── emails/templates.ts       # Templates HTML
├── services/
│   ├── lead.service.ts           # Persistência no Supabase
│   └── email.service.ts          # Envio de e-mails
├── types/lead.ts                 # Tipos do lead
└── components/contact/           # UI do formulário
```

---

## Segurança

- Validação server-side com Zod
- Sanitização de HTML e caracteres de controle
- Honeypot (`website`) contra bots
- Tempo mínimo de preenchimento (3s)
- Rate limit: 5 envios / 15 min por IP
- Bloqueio de duplicatas: mesmo e-mail em 5 min
- Chaves privadas apenas em variáveis server-side
- RLS no Supabase sem acesso público à tabela

---

## Suporte

Em caso de erro 503, verifique se `SUPABASE_SERVICE_ROLE_KEY` e `RESEND_API_KEY` estão configurados no ambiente.

Logs de erro aparecem no terminal (dev) ou nos logs da Vercel (produção).
