## Cena Studio Design System (Global)

Este design system centraliza **tokens globais** e padrões de UI para manter o frontend 100% consistente com a identidade do `index_1.html` / `index_2.html` (cinematográfico, high-end, alta precisão, low-radius).

### Tokens (fonte da verdade)

- **Arquivo**: `client/src/design-system/tokens.css`
- **Tipografia**
  - `--ds-font-display`: títulos (Bebas Neue)
  - `--ds-font-body`: texto (DM Sans)
  - `--ds-font-mono`: UI técnica (JetBrains Mono)
- **Cores**
  - `--ds-black`, `--ds-white`, `--ds-cream`
  - `--ds-orange`, `--ds-orange-2`, `--ds-orange-3`
  - `--ds-surface-*` (0–3) - camadas de fundo
  - `--ds-text-*` (1–4) - hierarquia de texto (1=primário, 4=desativado)
  - `--ds-state-*` - estados interativos (hover, active, disabled, focus)
- **Espaçamento**
  - `--ds-space-*` (0 → 32)
- **Bordas / radius**
  - `--ds-border-1`, `--ds-border-2`
  - `--ds-radius-0`, `--ds-radius-1` (2px)
- **Sombras**
  - `--ds-shadow-card`, `--ds-shadow-card-hover`
  - `--ds-shadow-elevated` - camada mais alta
  - `--ds-shadow-pressed` - estado pressionado
  - `--ds-shadow-glow` - destaque laranja
- **Motion**
  - `--ds-transition-fast/normal/slow`
  - `--ds-transition-bounce`, `--ds-transition-spring`
  - `--ds-ease-out/in`

### Classes globais (UI primitives)

As classes abaixo vivem em `client/src/index.css` e devem ser usadas como "peças base" para páginas e componentes:

- **Botões**
  - `frame-btn-primary`: CTA recortado (clip-path) + glow no hover
  - `frame-btn-ghost`: secundário/ghost com hover sutil + micro-interação
- **Inputs**
  - `frame-input`: input/textarea sharp, foco laranja
- **Cards**
  - `frame-card`: card "tool style" com barra lateral no hover + elevação
- **Navbar**
  - `frame-nav`, `frame-nav-link`, `frame-badge`
- **Tabelas**
  - `ds-table` (th/td/hover padronizados)
- **Superfícies / toolbars**
  - `ds-surface`, `ds-toolbar`
  - `app-panel` - container glass com backdrop-filter

### Regras de consistência (importante)

- **Não criar estilos por componente** para coisas que já são tokens/classe global.
- Preferir:
  - CSS variables (`tokens.css`) para decisão visual
  - classes globais para "primitives"
  - shadcn/ui customizado para consumir tokens (ex: `rounded-sm`, `bg-popover`, etc.)

