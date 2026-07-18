# LOGOS Design System — Component Catalog

Catálogo canônico dos componentes do produto. **Não altera identidade visual nem conteúdo** — define contratos, variantes e tokens obrigatórios.

Fonte de implementação:

| Camada | Path | Uso |
|--------|------|-----|
| Product UI | `src/components/logos/` | Marketing + brand components |
| Primitives | `src/components/ui/` | Base shadcn / Base UI |
| Dashboard | `src/components/dashboard/` | CRM shell e páginas |

Import preferido:

```ts
import { Button, Card, Input, Badge } from "@/components/logos";
// ou
import { Button } from "@logos/button";
```

---

## Icons

| Regra | Valor |
|-------|-------|
| Biblioteca | `lucide-react` |
| Tamanhos | `xs`–`2xl` via `iconSize` / `iconSizeClasses` em `tokens.ts` |
| Default em botões | `size-4` (`[&_svg:not([class*='size-'])]:size-4`) |
| Cor | herda do texto pai (`currentColor`) |

Não introduzir outra lib de ícones sem decisão de design.

---

## Buttons

**Componente:** `Button` · `CtaButton`  
**Variants:** `src/components/logos/variants/button.ts`

| Variant | Uso |
|---------|-----|
| `primary` | Ação principal |
| `secondary` | Ação secundária de marca |
| `accent` | Ênfase indigo |
| `outline` | Contorno neutro |
| `ghost` | Ação terciária |
| `destructive` | Ações destrutivas |
| `link` | Link inline |
| `cta` / `glow` | Marketing com glow |
| `nav-cta` | CTA da navbar floating |

**Sizes:** `sm` · `md` · `lg` · `xl` · `icon` · `icon-sm` · `icon-lg`

Tokens: `bg-brand-*`, `shadow-logos-glow`, `radius.lg`, motion `durations.normal`.

---

## Cards

**Componente:** `Card` (+ Header / Title / Description / Content / Footer)  
**Variants:** `default` · `outline` · `glass` · `elevated` · `ghost`  
**Padding:** `none` · `sm` · `md` · `lg`

Dashboard metric cards: `src/components/dashboard/shared/metric-card.tsx` — devem usar superfície `logos-glass` / `bg-logos-surface` e tipografia body.

---

## Inputs

**Componentes:** `Input` · `Textarea`  
**Variants:** `default` · `filled` · `ghost`  
**A11y:** `getFieldAriaProps` / `FieldControlProps` em `logos/lib/form-field.ts`

Cores: `border-logos-border`, `bg` via surface, focus `ring` = brand primary.

---

## Tables

Padrão dashboard:

- Container: `logos-glass` + `rounded-xl`
- Header: `border-logos-border border-b`
- Rows: tipografia `body-sm`, muted para meta
- Loading: `TableSkeleton` em `dashboard/shared/skeletons.tsx`

Não inventar estilos de tabela ad-hoc; reutilizar glass + border tokens.

---

## Dialogs / Modals / Drawers

| Componente | Uso |
|------------|-----|
| `Dialog` | Overlay padrão |
| `Modal` | Alias / wrapper de dialog |
| `Drawer` | Painel lateral / mobile |

Variants de conteúdo incluem superfície glass. Z-index: `zIndex.modal` (70). Overlay: `zIndex.overlay` (60).

---

## Badges

**Variants:** `primary` · `secondary` · `accent` · `outline` · `muted` · `success` · `warning` · `destructive`  
**Sizes:** `sm` · `md` · `lg`

Status `success` / `warning` usam emerald/amber (não brand). Status `destructive` usa `--destructive`.

---

## Alerts

Padrão tipado (sem componente isolado obrigatório hoje):

| Severity | Classes |
|----------|---------|
| info | `bg-brand-primary/10 text-brand-primary border-brand-primary/20` |
| success | `bg-emerald-500/15 text-emerald-400` |
| warning | `bg-amber-500/15 text-amber-400` |
| destructive | `bg-destructive/15 text-destructive` |

Radius: `rounded-lg` / `rounded-xl`. Sem cards extras desnecessários.

---

## Empty States

**Componente:** `EmptyState` — `dashboard/shared/empty-state.tsx`

Contrato: `icon` (Lucide) · `title` · `description` · `action?`  
Visual: `logos-glass`, ícone em círculo `bg-brand-primary/10`.

---

## Skeletons

**Componentes:** `TableSkeleton` · `CardGridSkeleton` (+ section skeletons em layout)

Regra: `animate-pulse` + `bg-logos-surface/60` dentro de containers glass. Não usar skeleton colorido.

---

## Loaders

Padrão:

- Inline: spinner SVG Lucide `Loader2` com `animate-spin text-brand-primary`
- Página: skeleton preferível a spinner fullscreen
- Botões: disabled + opacity (já no CVA)

---

## Charts

Biblioteca: `recharts`.  
Cores: `--chart-1` … `--chart-5` (bridge do tema).  
Em código TS preferir `colorTokens.chart` ou CSS vars — evitar hex literais novos.

---

## Sidebar

**Componente:** `dashboard/layout/sidebar.tsx`  
Larguras: `layoutSpacing.dashboardSidebarExpanded` (`16rem`) / `collapsed` (`4.5rem`).  
Cores: `--sidebar-*` bridged do tema. Itens ativos: primary / accent sidebar tokens.

---

## Navbar

**Marketing:** `Navbar` floating pill — `logos-navbar-pill`, blur 12px, glass.  
**Dashboard:** `topbar.tsx` sticky com glass/blur.

Não substituir a pill flutuante por navbar full-bleed plana.

---

## Dashboard Components

| Peça | Path |
|------|------|
| Shell | `dashboard/layout/dashboard-shell.tsx` |
| Sidebar | `dashboard/layout/sidebar.tsx` |
| Topbar | `dashboard/layout/topbar.tsx` |
| Page header | `dashboard/shared/page-header.tsx` |
| Metric card | `dashboard/shared/metric-card.tsx` |
| Empty state | `dashboard/shared/empty-state.tsx` |
| Skeletons | `dashboard/shared/skeletons.tsx` |

Shell: `bg-logos-bg text-logos-text`, main padding `p-4 sm:p-6 lg:p-8`.

---

## Layout primitives

| Componente | Notas |
|------------|-------|
| `Container` | Max-width + padding tokens |
| `Section` | Spacing vertical de seções marketing |
| `Footer` | Footer de marca |

---

## Effects (premium)

Exportados de `@/components/logos` / `effects/`: Aurora, Particles, Spotlight, GlowBorder, etc.  
Intensidade: `effectIntensity` em `motion.ts` (`subtle` · `medium` · `strong`).  
Easing de loop: `easings.effect`.

---

## Regras de padronização

1. Novos componentes de produto → `src/components/logos/` com CVA em `variants/`.
2. Usar tokens/classes LOGOS; não hardcodar hex de marca.
3. Variants nomeadas semanticamente (`primary`, `glass`), não por cor (`blue`).
4. `data-slot="logos-*"` onde o padrão já existe.
5. Acessibilidade: focus ring visível, labels, `aria-*` em forms.
6. Light mode dashboard: respeitar overrides em `globals.css`; testar glass/glow.
