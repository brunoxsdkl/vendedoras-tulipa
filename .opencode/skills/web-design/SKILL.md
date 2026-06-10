---
name: web-design
description: >
  Cria designs elaborados e profissionais para sites com foco em UI/UX moderno,
  tipografia refinada, animações sutis, paletas harmônicas e layout responsivo.
  Ative esta skill quando o usuário pedir algo "bem elaborado" ou "bonito".
license: MIT
compatibility: opencode
metadata:
  category: design
  style: modern
---

## Diretrizes de Design

### 1. Hierarquia Visual
- Títulos com `font-size` escalas maiores (ex: 3rem+ para hero)
- Contraste claro entre títulos, subtítulos e corpo
- Uso de `font-weight` variado (300, 400, 600, 700)

### 2. Tipografia
- Prefira fontes system-ui ou Google Fonts (Inter, Poppins, DM Sans)
- Line-height entre 1.2 (títulos) e 1.7 (texto)
- Limite de ~70 caracteres por linha para legibilidade

### 3. Paleta de Cores
- Defina 3-5 cores no CSS: primary, secondary, accent, surface, text
- Use `oklch()` ou `hsl()` para cores com transparência via `oklch(color / alpha)`
- Gradientes sutis com ângulos inclinados (ex: `135deg`)
- Sempre inclua modo escuro via `prefers-color-scheme`

### 4. Layout & Espaçamento
- Use CSS Grid e Flexbox juntos
- Container max-width: 1200px com padding lateral
- Espaçamento consistente (4/8/12/16/24/32/48/64/96px)
- Section padding: `clamp(3rem, 8vh, 6rem)`

### 5. Cards & Componentes
- Border-radius: 8-16px
- Sombras: `box-shadow` com `rgba` ou `hsl` suaves
- Hover com `transform: translateY(-2px)` e `transition: 0.2s ease`
- Glassmorphism sutil: `backdrop-filter: blur(12px)` + `background: hsl(0 0% 100% / 0.7)`

### 6. Animações
- `@keyframes fadeInUp` e `fadeIn` para entradas
- `animation` com delays escalonados (0.1s, 0.2s, 0.3s...)
- `prefers-reduced-motion: reduce` para acessibilidade
- Transições em links, botões e cards

### 7. Responsividade
- Mobile-first com `min-width`
- Grid adaptável com `auto-fit` e `minmax()`
- Navegação colapsável em mobile
- Touch targets mínimos de 44px

### 8. Acessibilidade
- Contraste mínimo WCAG AA (4.5:1 texto normal)
- `aria-label` em ícones e botões sem texto
- Foco visível com `outline` personalizado
- Suporte a `prefers-reduced-motion`

### 9. Código Limpo
- CSS modules ou Tailwind organizado
- Variáveis CSS para consistência
- Componentes React pequenos e reutilizáveis
- Comentários mínimos, código autoexplicativo
