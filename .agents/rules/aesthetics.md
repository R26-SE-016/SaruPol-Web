# SaruPol Web – Agent Design Standards

## Brand Identity
- **Project Name**: SaruPol
- **Full Title**: SaruPol | Coconut Research Intelligence Platform
- **Tagline**: AI & IoT-driven Decision Support for Sri Lankan Coconut Plantations

## Design Tokens (MANDATORY)

### Color Palette
- Background: `#030705` (Deep Obsidian)
- Surface: `#08140E` (Emerald Surface)
- Deep: `#0F291E` (Emerald Deep)
- Foreground: `#e8efe8`
- Neon Emerald Accent: `#00FF9D`
- Telemetry Cyan: `#00E5FF`
- Advisory Amber: `#E6AF2E`
- Critical Red: `#FF4C4C`
- Operations Purple: `#A78BFA`
- Glass: `rgba(255, 255, 255, 0.04)` with `border: 1px solid rgba(255, 255, 255, 0.08)`

### Typography
- **Headings**: `Outfit` (font-light, tracking-tight)
- **Body**: `Plus Jakarta Sans` (default sans-serif)
- **Monospace/Telemetry**: `JetBrains Mono` (for data values, coordinates, model metrics, timestamps)

### Glassmorphism Standards
- Always use `backdrop-filter: blur(16px+)` with semi-transparent backgrounds
- Card border radius: `1.25rem` (20px)
- Panel border radius: `1rem` (16px)
- Use `.glass-card` or `.glass-panel` CSS classes

## Prohibited Patterns (UI Slop)
- ❌ Never use system/browser default fonts
- ❌ Never use plain unstyled HTML tables
- ❌ Never use un-animated layout shifts
- ❌ Never use flat gray backgrounds (#f5f5f5, #eee)
- ❌ Never use generic blue/red primary colors
- ❌ Never show raw JSON to users
- ❌ Never use default scrollbar styles
- ❌ Never use `cursor: default` — this project uses a custom cursor

## Module Color Assignments
| Module | Primary Color | Usage |
|--------|---------------|-------|
| Soil Intelligence | `#00FF9D` | Emerald Neon |
| Pathology Lab | `#FF4C4C` | Critical Red |
| CocoCastAI Yield | `#00E5FF` | Telemetry Cyan |
| Advisory AI | `#E6AF2E` | Advisory Amber |
| Field Operations | `#A78BFA` | Operations Purple |

## Animation Standards
- Use `framer-motion` for all page transitions and component reveals
- Spring physics: `stiffness: 400-500, damping: 25-30`
- Stagger children animations: `delay: 0.05-0.1s` per item
- Use `smooth-transition` class for hover states (cubic-bezier 0.4, 0, 0.2, 1)

## Component Patterns
- Every page must include `<Navbar />` component
- Data values must use `font-mono` (JetBrains Mono)
- Status indicators must use pulsing dots (`.animate-pulse-emerald`)
- Interactive cards must have hover glow effects
- Loading states must use emerald-themed spinners or loading dots

## API Integration
- All API calls go through `SaruPol-Gateway` at `http://localhost:8000`
- Use the unified client from `@/lib/api.ts`
- Always handle offline/fallback scenarios gracefully with mock data
