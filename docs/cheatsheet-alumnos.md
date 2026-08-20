# Cheatsheet — Experimentación en APP

## El flujo estratégico completo

1. **Problema**: identifica el cuello de botella (datos cuantitativos)
2. **Diagnóstico**: entiende el por qué (investigación cualitativa)
3. **Referentes**: mira cómo lo resuelven otros (benchmarks)
4. **Hipótesis**: formula "Si X, entonces Y, porque Z"
5. **Cuello de botella**: ¿el equipo de desarrollo está saturado?
6. **Solución con IA**: Cursor/Claude para generar código
7. **Feature flag + Statsig**: lanza sin deploy
8. **Mide**: lift, significancia, impacto en negocio

## APIs de Statsig que usarás

```tsx
const { value } = useGate('gate_name');
const config = useDynamicConfig('config_name');
const color = config.get('button_color', '#default');
client.logEvent('purchase_completed', { amount: 29.99 });
```

```tsx
// Dynamic Config con múltiples parámetros (ej: duel_config)
const config = useDynamicConfig('duel_config');
const timeLimit = config.get('time_limit', 30) as number;
const showBanner = config.get('show_bonus_banner', false) as boolean;
const bannerText = config.get('bonus_banner_text', '🔥 2x XP!') as string;
```

## Estructura de un prompt efectivo

**Contexto:** qué app, qué tecnología, qué problema
**Objetivo:** qué quiero que genere
**Restricciones:** librerías, convenciones, estilo
**Formato:** qué quiero como output

### Ejemplo real (live coding de la sesión):
> "Tengo una app de fitness en React Native (Expo). El archivo DuelScreen.tsx
> ya está conectado a Statsig con useDynamicConfig('duel_config').
> Necesito agregar un banner condicional controlado por show_bonus_banner (bool)
> que muestre el texto de bonus_banner_text. Aparece entre vsCard y rewardBadge.
> Estilo: borde verde #BBF246, fondo oscuro, borderRadius 12.
> Solo dame el código a agregar. Sin explicaciones."

## Flujo para lanzar un experimento

1. Hipótesis + métrica primaria
2. Generar componente con Cursor/Claude
2b. O usa Antigravity/Cursor con Gemini para generar el código del componente
3. Envolver en useGate()
4. Conectar a useDynamicConfig()
5. Configurar experimento en Statsig
6. Lanzar (50/50)
7. Leer resultados (lift, p-value, confianza)
8. Promocionar ganador o descartar
9. Limpiar el flag

## Buenas prácticas

✅ Prefijos en nombres | ✅ Un propósito por flag | ✅ Fecha de expiración | ✅ Limpiar flags
❌ Anidar flags | ❌ No limpiar flags | ❌ Hardcodear valores
✅ Remote Config para valores mutables (texto, números, colores) | ❌ Hardcodear en código

## Configuración de claves Statsig

| Clave | Para qué | Dónde va |
|---|---|---|
| `client-...` | SDK en la app (leer gates/configs) | `src/config/statsig.ts` |
| `console-...` | API y MCP (crear/modificar configs) | Variables de entorno / MCP config |

**Dónde obtener la Console API Key:**
`console.statsig.com → Settings → Keys & Environments → Console API Keys`

## Statsig MCP — IA que opera la consola

El MCP (Model Context Protocol) conecta Claude o Gemini directamente a la API de Statsig. Con esto la IA puede crear gates, dynamic configs y experimentos sin que abras la consola manualmente.

**Configuración en `claude_desktop_config.json` o en tu IDE con MCP:**
```json
{
  "mcpServers": {
    "statsig": {
      "command": "npx",
      "args": ["-y", "statsig-mcp-server"],
      "env": {
        "STATSIG_CONSOLE_API_KEY": "console-tu-key-aqui"
      }
    }
  }
}
```

**Ejemplo de uso:**
> "Crea un Dynamic Config llamado `challenge_config` con los campos: `time_limit: 60`, `xp_reward: 100`, `show_banner: false`"
→ Claude lo crea en Statsig via MCP en segundos, sin que toques la consola.

**Qué puede hacer el MCP de Statsig:**
- Crear y actualizar Feature Gates y Dynamic Configs
- Lanzar y pausar experimentos
- Consultar resultados y versiones

## Herramientas para el live coding

| Herramienta | Modelo | Acceso |
|---|---|---|
| Antigravity IDE | Gemini (Google Suite) | Google Workspace |
| Cursor | Claude / GPT-4 | Pago personal |
| claude.ai | Claude | Pago personal |

**Para la demo:** Antigravity con Gemini es suficiente para generar integraciones de Statsig en React Native.
