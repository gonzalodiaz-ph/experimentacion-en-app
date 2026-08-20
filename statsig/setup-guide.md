# Setup de Statsig — Paso a paso

## 1. Crear cuenta
Ve a statsig.com → Get Started Free. Plan gratuito: 50k MAU.

## 2. Obtener las dos claves

### Client SDK Key (para la app)
`console.statsig.com → Settings → Keys & Environments → Client SDK Keys`
→ Copia la key con prefijo `client-` → Pégala en `src/config/statsig.ts`

### Console API Key (para MCP y scripts)
`console.statsig.com → Settings → Keys & Environments → Console API Keys → Generate New Key`
→ Guárdala en tus variables de entorno — **nunca en el código de la app**

## 2b. Configurar el MCP de Statsig (opcional, pero muy recomendado)

El MCP permite que Claude o cualquier IA con soporte MCP cree y gestione gates, configs y experimentos directamente desde el chat, sin abrir la consola.

**En Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
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

**En Claude Code** (vía `claude mcp add`):
```bash
STATSIG_CONSOLE_API_KEY=console-tu-key npx -y statsig-mcp-server
```

**Lo que puedes hacer con el MCP activo:**
- "Crea un Dynamic Config llamado `challenge_config` con `time_limit: 60`"
- "Actualiza `duel_config` para que `show_bonus_banner` sea `true`"
- "Lista todos los Feature Gates del proyecto"
- "Muéstrame los resultados del experimento `onboarding_experiment`"

## 3. Crear Feature Gates
- `onboarding_express_duel` (default: false)
- `premium_social_proof` (default: false)

## 4. Crear Dynamic Configs
- `onboarding_config`: {"type":"classic","steps":2,"show_duel":false,"xp_reward":0}
- `premium_modal_config`: {"title":"Heeal Premium","cta_text":"Suscribirse — 4,99€/mes","show_social_proof":false,"show_urgency":false,"show_comparison":false}

## 5. Crear Experimentos
- `onboarding_experiment`: 50/50, métrica: first_duel_completion_rate
- `premium_experiment`: 50/50, métrica: premium_conversion_rate
