# LOGOS Design System

Sistema de design profissional do produto LOGOS.  
**Princípio:** profissionalizar tokens, contratos e documentação **sem alterar identidade visual, conteúdo ou comportamento dos componentes existentes**.

---

## Arquitetura

```
src/design-system/          ← API TypeScript canônica
  colors.ts                 ← Marca, semântica, status, charts, gradients
  spacing.ts                ← Escala 4px + layout spacing
  typography.ts             ← Families, scale, presets, classes
  motion.ts                 ← Easing, durations, variants, effects
  tokens.ts                 ← Agregador (radius, shadows, blur, glass, grid, icons, z-index)
  components.md             ← Catálogo de componentes
  themes/                   ← Tema logos-default + brand hex
  index.ts                  ← Barrel público

src/styles/
  tokens.css                ← Primitivos CSS (--logos-space-*, radius, blur…)
  themes/logos-default.css  ← Brand + semantic + shadcn bridge
  typography.css            ← Utility classes de tipo
  utilities.css             ← glass, glow, container, text-gradient

src/components/logos/       ← Product UI (CVA + brand classes)
src/components/ui/          ← Primitives shadcn / Base UI
src/components/dashboard/   ← Shell CRM
```

**Runtime visual = CSS variables + Tailwind.**  
TypeScript espelha valores para tipagem, documentação e acesso programático (emails, OG, charts).

---

## Identidade visual (imutável neste DS)

| Token | Hex |
|-------|-----|
| Primary | `#2563EB` |
| Secondary | `#1D4ED8` |
| Accent | `#4F46E5` |
| Background | `#0B0F19` |
| Surface | `#111827` |
| White | `#F8FAFC` |

**Tipografia**

| Role | Family | CSS var |
|------|--------|---------|
| Heading | Sora | `--font-heading` |
| Body | Inter | `--font-body` |
| Wordmark | Michroma | `--font-wordmark` |

**Assinatura de produto:** dark navy, blue → indigo, glassmorphism, glow brand, navbar floating pill, reveals Framer Motion.

Para mudar a marca de um cliente: editar **em sincronia**:

1. `src/design-system/colors.ts` (`brandColors`)
2. `src/styles/themes/logos-default.css` (ou tema cliente)
3. Reexports em `themes/brand-colors.ts` (já derivados de `colors.ts`)

---

## Design Tokens

### Import

```ts
import {
  tokens,
  brandColors,
  colorTokens,
  spacing,
  radius,
  shadows,
  blur,
  glass,
  gradients,
  motionTransitions,
  typographyPresets,
} from "@/design-system";
```

### Colors

- `brandColors` — hex canônicos
- `colorTokens.brand` / `.semantic` / `.status` / `.chart` / `.sidebar` — `var(--logos-*)`
- `gradients` — text, brand, surface, glow
- `colorClasses` — classes Tailwind preferidas em JSX

### Spacing

- Base **4px** (`0.25rem`)
- Escala `0` → `96` (+ `px`, meios)
- `layoutSpacing` — section, stack, page padding, sidebar widths

### Typography

- Escala display → overline
- Presets com family + size + weight + leading + tracking
- Classes: `logos-font-*`, `logos-text-*`

### Radius

`none` · `xs` · `sm` · `md` · `lg` · `xl` · `2xl` · `3xl` · `full`  
Default de produto (shadcn `--radius`): `lg` (0.75rem).

### Shadows

`xs` → `xl` + `glow` + `glow-accent` (glow usa `color-mix` da marca no tema).

### Blur

`none` · `xs`(4) → `3xl`(64). Glass usa `lg` por padrão.

### Glass

Tokens: `bg`, `bgStrong`, `border`, `blur`, `shadow`.  
Classes: `logos-glass`, `logos-glass-strong`, `logos-navbar-pill`.

### Gradients

Preferir `.logos-text-gradient` em UI. Objeto `gradients` para SVG/canvas/email quando necessário.

### Motion

| Token | Valor |
|-------|-------|
| `easings.standard` | `[0.25, 0.1, 0.25, 1]` |
| `easings.effect` | `[0.45, 0, 0.55, 1]` |
| `durations.normal` | `0.3s` |
| `durations.slow` | `0.6s` |
| Section stagger | `0.08` |
| Viewport | `once`, margin `-80px` |

Compat: `@/config/motion` reexporta o mesmo módulo.

### Grid

12 colunas · gaps `sm`/`default`/`lg` via spacing tokens.

### Breakpoints / Containers

Breakpoints: `xs` 475 → `2xl` 1536.  
Containers: até `2xl` **1400px** (não 1536).

### Icons

Biblioteca: **lucide-react**. Tamanhos em `iconSize` / `iconSizeClasses`.

### Z-index

`base` → `tooltip` (0 … 90). Modais em `70`, toasts `80`.

---

## Regras de uso

1. **Não hardcodar** hex de marca em componentes novos — use classes `bg-brand-*` / `text-logos-*` / CSS vars.
2. **Não quebrar** CVA existente; estender variants em vez de forkar estilos.
3. Product UI → `@/components/logos`. Primitives → `@/components/ui` apenas como base.
4. Dashboard light mode: validar contraste e glass após mudanças de tema.
5. Efeitos premium usam `easings.effect` e `effectIntensity`; UI chrome usa `easings.standard`.
6. Um job visual por seção marketing; glow/glass são assinatura — não remover sem decisão de marca.
7. Conteúdo (copy, i18n, dados) é independente do DS — **não alterar** ao evoluir tokens.

---

## Componentes

Ver catálogo completo: [`src/design-system/components.md`](./src/design-system/components.md)

Cobertura:

- Icons · Buttons · Cards · Inputs · Tables · Dialogs  
- Badges · Alerts · Empty States · Skeletons · Loaders · Charts  
- Sidebar · Navbar · Dashboard Components  
- Layout (Container, Section, Footer) · Effects

---

## Light mode (dashboard)

Overrides em `src/app/globals.css` sob `:root.light, .light`.  
Brand background/surface/text invertidos para CRM claro. Glow/glass devem continuar legíveis.

---

## Checklist ao adicionar token

- [ ] Valor em TypeScript (`colors.ts` / `spacing.ts` / `tokens.ts` / …)
- [ ] Espelho CSS em `tokens.css` ou tema
- [ ] Classe Tailwind / utility se for uso em JSX
- [ ] Documentar aqui ou em `components.md`
- [ ] Sem regressão visual (mesmos valores hex/radius atuais)

---

## Checklist ao adicionar componente

- [ ] Vivem em `logos/` (produto) ou `dashboard/` (CRM)
- [ ] CVA com variants semânticas
- [ ] Tokens/classes LOGOS apenas
- [ ] Entrada no `components.md`
- [ ] A11y (focus, labels, slots)
- [ ] Export no barrel apropriado

---

## Anti-padrões

- Hex literais de marca espalhados (exceto sync email/OG/SVG legado)
- Segunda biblioteca de ícones
- Cards no hero marketing sem necessidade interativa
- Alterar Sora/Inter/Michroma ou a paleta acima “só para modernizar”
- Importar `@/components/ui/button` em páginas de produto quando existe `logos/Button`
