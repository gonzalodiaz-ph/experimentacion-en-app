# Experimentacion en APP

**Modulo 7 - Experimentacion, validacion y CRO | Master en Growth - PH School**

Repositorio de la sesion *Experimentacion en APP*, donde se muestra como un perfil de Growth puede implementar experimentos directamente en producto sin depender del ciclo de desarrollo tradicional.

Se usa **Claude/Cursor** para generar codigo y **Statsig** para gestionar feature flags, remote config y experimentos A/B, permitiendo activar o modificar features en tiempo real sin nuevos despliegues.

---

## Que hay en este repo

```
experimentacion-en-app/
|-- heeal-app/               App demo (React Native + Expo + Statsig)
|-- prompts/                  Los 4 prompts usados en la sesion
|   |-- prompt-1-statsig-sdk.md       Integrar el SDK de Statsig
|   |-- prompt-2-express-duel.md      Generar el onboarding expres
|   |-- prompt-3-premium-modal.md     Modal premium con social proof
|   |-- prompt-4-feature-flag.md      Conectar el feature gate
|-- statsig/                  Guias de configuracion de Statsig
|   |-- setup-guide.md                Paso a paso para crear cuenta y configurar
|   |-- experiment-setup.md           Configuracion de los 2 experimentos
|-- docs/
|   |-- cheatsheet-alumnos.md         Hoja de referencia rapida
|   |-- Guia-Referencia-Experimentacion-APP.html   Guia completa (abrir en navegador)
```

---

## El caso practico: Heeal

Heeal es una app de fitness gamificada donde los usuarios compiten en duelos de entrenamiento. Usamos sus metricas reales como caso de estudio para disenar y lanzar dos experimentos.

| Metrica | Actual | Objetivo | Gap |
|---|---|---|---|
| Activacion | 45% | 70% | -25pp |
| Conversion premium | 3% | 5% | -2pp |
| Churn mensual | 13% | 5% | +8pp |
| Revenue | 94.250 EUR | 300.000 EUR | -205.750 EUR |

---

## Los dos experimentos

### Experimento 1: Onboarding con duelo expres

**Hipotesis:** Si al registrarse mostramos un duelo instantaneo contra un bot con 500 XP (en lugar del onboarding clasico de 2 pasos), la activacion subira del 45% al 65%.

| | Control | Variante |
|---|---|---|
| Pantallas | Nombre + Avatar (2 pasos) | Duelo expres (1 paso) |
| Recompensa | Ninguna | 500 XP + skin exclusiva |
| Time-to-value | ~90 segundos | ~15 segundos |

### Experimento 2: Modal premium con social proof

**Hipotesis:** Si mostramos prueba social (12.847 usuarios), urgencia (3 dias gratis) y comparativa Free vs Premium, la conversion subira del 3% al 6%.

| | Control | Variante |
|---|---|---|
| Titulo | "Heeal Premium" | "Unite a 12.847 usuarios" |
| CTA | "Suscribirse - 4,99 EUR/mes" | "Comenzar prueba gratis" |
| Social proof | No | Si (4.8 estrellas, 12.847 usuarios) |
| Comparativa | No | Si (Free vs Premium) |

---

## Como arrancar la app

### Prerequisitos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Una cuenta gratuita en [Statsig](https://statsig.com/)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU-USUARIO/experimentacion-en-app.git
cd experimentacion-en-app/heeal-app

# 2. Instalar dependencias
npm install

# 3. Configurar tu API key de Statsig
# Abre src/config/statsig.ts y reemplaza 'client-TU-API-KEY-AQUI'
# con tu Client SDK Key (ver instrucciones abajo)

# 4. Arrancar la app
npx expo start
```

### Obtener tu Client SDK Key de Statsig

1. Ve a [console.statsig.com](https://console.statsig.com)
2. Crea una cuenta gratuita (plan Free: 50k MAU)
3. Ve a **Settings** > **Keys & Environments** > **Client SDK Keys**
4. Copia la key con prefijo `client-...`
5. Pegala en `heeal-app/src/config/statsig.ts`

> **Importante:** Nunca compartas tu Console API Key (prefijo `console-...`). La Client SDK Key es de solo lectura y es la unica que va en el codigo de la app.

---

## Configurar Statsig para los experimentos

Sigue la guia completa en [`statsig/setup-guide.md`](statsig/setup-guide.md). Resumen:

### Feature Gates (interruptores)
- `onboarding_express_duel` - controla que onboarding ve el usuario
- `premium_social_proof` - controla que modal premium ve el usuario

Las reglas de un gate se evaluan de arriba a abajo. Cada regla tiene condiciones (por user ID, email, pais, OS, etc.) y un porcentaje de pase. Usa el patron de canary rollout para lanzar gradualmente: `0% → 2% → 10% → 50% → 100%`.

### Dynamic Configs (mandos a distancia)
- `onboarding_config` - parametros del onboarding (tipo, pasos, XP)
- `duel_config` - parametros del duelo (tiempo, XP, banner bonus)
- `premium_modal_config` - parametros del modal premium (titulo, CTA, social proof)

Un Dynamic Config devuelve valores estructurados (strings, numeros, booleanos) que modificas sin deploy. Usa un gate cuando necesites on/off. Usa un config cuando necesites devolver valores que cambian.

### Experimentos
- `onboarding_experiment` - 50/50, metrica: `first_duel_completed`
- `premium_experiment` - 50/50, metrica: `premium_purchased`

Cada experimento tiene metricas **primary** (decide si gana), **secondary** (explora efectos) y **guardrail** (protege lo que no debe empeorar). Ver detalles en [`statsig/experiment-setup.md`](statsig/experiment-setup.md).

### Gate vs Experiment: cuando usar cada uno

| | Feature Gate | Experiment |
|---|---|---|
| Variantes | 2 (pass/fail) | Cualquier numero |
| Retorno | Booleano | JSON con parametros |
| Para que | Rollout gradual, kill switch | Comparar variantes, medir impacto |

En la practica se combinan: el gate filtra la audiencia → el experiment asigna a control/variante → si la variante gana, subes el gate al 100%.

---

## Statsig MCP: la IA que opera la consola

Puedes conectar Claude o cualquier IA compatible con MCP directamente a tu cuenta de Statsig. Esto permite crear gates, configs y experimentos desde lenguaje natural, sin abrir la consola.

### Configuracion

```json
{
  "mcpServers": {
    "statsig": {
      "command": "npx",
      "args": ["-y", "statsig-mcp-server"],
      "env": {
        "STATSIG_CONSOLE_API_KEY": "console-TU-CONSOLE-KEY-AQUI"
      }
    }
  }
}
```

> La Console API Key se obtiene en `console.statsig.com > Settings > Keys & Environments > Console API Keys > Generate New Key`. Esta key **nunca** va en el codigo de la app; solo en tu entorno local (variables de entorno, config del IDE).

### Que puede hacer el MCP

| Categoria | Acciones |
|---|---|
| Feature Gates | Crear, listar, actualizar, ver historial, limpiar codigo obsoleto |
| Dynamic Configs | Crear, actualizar, ver historial, listar con filtros |
| Experiments | Crear, ver resultados y lifts, analizar por dimensiones |
| Metrics | Listar fuentes, ver definiciones y configuraciones |
| Segments | Crear segmentos (ID lists, reglas, listas de analisis) |
| Logs | Consultar eventos raw, detectar anomalias |

### Ejemplo de uso

```
Tu: "Crea un Dynamic Config llamado challenge_config con time_limit: 60, xp_reward: 100"
Claude (via MCP): Config creado exitosamente en Statsig.
```

---

## Recursos adicionales

| Recurso | Link |
|---|---|
| Statsig Docs | [docs.statsig.com](https://docs.statsig.com) |
| Feature Flags overview | [docs.statsig.com/feature-flags/overview](https://docs.statsig.com/feature-flags/overview) |
| Experiments overview | [docs.statsig.com/experiments-plus/overview](https://docs.statsig.com/experiments-plus/overview) |
| React Native SDK | [@statsig/react-bindings](https://www.npmjs.com/package/@statsig/react-bindings) |
| Statsig MCP Server | [statsig-mcp-server](https://www.npmjs.com/package/statsig-mcp-server) |
| Cheatsheet | [`docs/cheatsheet-alumnos.md`](docs/cheatsheet-alumnos.md) |
| Los 4 prompts | [`prompts/`](prompts/) |
| Setup Statsig | [`statsig/setup-guide.md`](statsig/setup-guide.md) |
| Config de experimentos | [`statsig/experiment-setup.md`](statsig/experiment-setup.md) |
| Guia completa (HTML/PDF) | [`docs/Guia-Referencia-Experimentacion-APP.html`](docs/Guia-Referencia-Experimentacion-APP.html) |

---

## Reto para la semana

> Coge 1 experimento del roadmap de Heeal que ya tienes planificado y configuralo en Statsig: gates, dynamic config y metrica primaria. Sin codigo todavia.

---

**Sesion impartida por:** Gonzalo Diaz - Growth Manager, Product Hackers

**PH School** | Master en Growth
