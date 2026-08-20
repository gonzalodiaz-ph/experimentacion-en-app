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

| Categoría | Ejemplos de comandos |
|---|---|
| **Feature Gates** | Crear, listar, actualizar, ver historial de versiones, limpiar código obsoleto |
| **Dynamic Configs** | Crear, actualizar, ver historial, listar con filtros |
| **Experiments** | Crear, ver resultados y lifts, analizar por dimensiones, iniciar cleanup |
| **Autotunes** | Crear experimentos multi-armed bandit con brazos y variantes |
| **Layers** | Crear y gestionar capas de experimentos paralelos |
| **Metrics** | Listar fuentes de métricas, ver definiciones y configuraciones |
| **Segments** | Crear segmentos (ID lists, reglas, listas de análisis) |
| **Logs** | Consultar eventos raw, agrupar patrones, detectar anomalías |
| **Reviews** | Flujo de aprobación: crear, editar, aprobar, rechazar, commitear |

Ejemplos concretos:
- "Crea un Dynamic Config llamado `challenge_config` con `time_limit: 60`"
- "Actualiza `duel_config` para que `show_bonus_banner` sea `true`"
- "Lista todos los Feature Gates del proyecto"
- "Muéstrame los resultados del experimento `onboarding_experiment`"
- "Identifica gates obsoletos que ya no se usan en el código"

> **Permisos**: usuarios read-only pueden usar todas las herramientas de lectura. Las herramientas de escritura requieren una API key con permisos de escritura.

---

## 3. Crear Feature Gates

| Gate | Default | Propósito |
|---|---|---|
| `onboarding_express_duel` | false | Controla qué versión del onboarding ve el usuario |
| `premium_social_proof` | false | Controla qué versión del modal premium se muestra |

### Cómo funcionan los gates

Un Feature Gate es un interruptor booleano (true/false) que el SDK evalúa en tiempo real. Statsig procesa las **reglas de arriba a abajo**: el usuario cae en la primera regla que cumple y sale del pipeline de evaluación.

Cada regla tiene:
- **Condiciones**: quién cumple (por user ID, email, país, OS, app version, campos custom, etc.)
- **Porcentaje de pase**: qué fracción de los que cumplen la condición recibe `true`

**Operadores disponibles en condiciones:**
- Identidad: `any of`, `none of`, `contains`, `regex`
- Numéricos/versión: `>=`, `>`, `<`, `<=`
- Existencia: `is null`, `is not null`
- Temporales: `after time`, `before time`
- Lógicos: `passes target gate`, `fails target gate`, `user in segment`

**Estabilidad**: La evaluación es determinista por userID + salt del gate. Un usuario siempre obtiene el mismo resultado a menos que hagas *resalting* (regenerar el salt para redistribuir usuarios).

**Overrides**: Puedes forzar pass/fail para usuarios específicos desde la consola (útil para QA). Estos usuarios no se cuentan en el análisis del experimento.

### Crear un gate en la consola (paso a paso)

1. `console.statsig.com → Feature Management → Feature Gates → Create`
2. Completa **nombre** (ej: `onboarding_express_duel`) y **descripción**
3. El gate nace en `false` sin reglas — bloquea a todos hasta que configures targeting
4. Click **+ Add New Rule** y dale un nombre descriptivo (ej: "Mobile Users Only")
5. Configura:
   - **Environment(s)**: staging o production
   - **Criteria**: las condiciones de targeting
   - **Split %**: porcentaje de usuarios que cumplen la condición y pasan
   - **Overrides**: lista de usuarios que siempre pasan (bypass para QA)
6. **Save** (no hay auto-save)

> Las reglas se evalúan de arriba a abajo. Puedes arrastrarlas para reordenar o insertar entre ellas.

### Patrón de canary rollout

El patrón recomendado por Statsig para lanzar gradualmente:

```
0% → 2% → 10% → 50% → 100%
```

En cada paso, monitorea métricas de usuario (retención, conversión, DAU/WAU) y métricas de sistema (error rates, latencia, CPU). Solo avanza al siguiente porcentaje si todo está OK.

### Ejemplo: rollout gradual del onboarding

1. Regla 1: equipo interno (emails `@producthackers.com`) → 100% pass
2. Regla 2: usuarios de España → 50% pass (lanzamiento gradual)
3. Regla 3: resto del mundo → 0% pass (todavía no)

### Best practices para Feature Gates

- **Un propósito por gate**: usar un gate para controlar múltiples features dificulta el debugging
- **Gatear código nuevo aunque no esté listo**: despliega inactivo y activa cuando las dependencias estén OK
- **Ship rápido en main**: evita branches largos; el gate mantiene el código inactivo en producción
- **Validar con usuarios de confianza**: expón la feature primero al equipo, empleados y beta testers
- **Limpiar gates obsoletos**: cuando dejes de consultar un gate, elimínalo del código y bórralo de la consola
- **Auditoría**: mantén logs de todas las modificaciones de gates del equipo

---

## 3b. Feature Gate vs Experiment: cuándo usar cada uno

| | Feature Gate | Experiment |
|---|---|---|
| **Variantes** | 2 (pass / fail) | Cualquier número (A, B, C, D...) |
| **Retorno** | Booleano (true/false) | JSON con parámetros por variante |
| **Tráfico** | Pass % ajustable (1%, 10%, 99%) | Allocation % + split equitativo (máx 50/50) |
| **Propósito** | Rollout gradual + kill switch | Comparar variantes y medir impacto causal |

### Cuándo usar un gate

- Lanzar una feature única con rollout progresivo
- Necesitas un kill switch para desactivar rápido
- Quieres targeting de audiencia antes de enrollar en un experimento
- Control simple on/off para un code path

### Cuándo usar un experiment

- Comparar múltiples opciones (textos, diseños, flujos)
- Necesitas medir el impacto causal en métricas específicas
- Quieres análisis dimensional (por país, plataforma, segmento)
- Correr tests paralelos aislados con layers

### Flujo combinado (gate + experiment)

En la práctica usas ambos juntos en 3 pasos:

```
1. Targeting gate → filtra la audiencia elegible
2. Allocation %   → decide cuántos de esa audiencia participan en el test
3. Split %        → distribuye participantes entre control y variante(s)
```

**Después del test**: si la variante gana, levantas el targeting gate al 100% para que todos reciban la experiencia ganadora. Así es como funcionan nuestros dos experimentos de Heeal.

---

## 4. Crear Dynamic Configs

Un Dynamic Config es un JSON remoto que la app lee en tiempo real. A diferencia de un gate (booleano on/off), un config devuelve **valores estructurados** (strings, números, booleanos, objetos) que puedes modificar sin nuevo deploy.

> **Límite**: payload máximo de 100kb por config.

> **Regla de decisión**: usa un gate cuando necesites un booleano on/off. Usa un dynamic config cuando necesites devolver valores que cambian (textos, números, colores, configuraciones).

Crear estos tres configs:

**`onboarding_config`**
```json
{
  "type": "classic",
  "steps": 2,
  "show_duel": false,
  "xp_reward": 0
}
```

**`duel_config`**
```json
{
  "time_limit": 30,
  "remaining_duels": 2,
  "xp_reward": 50,
  "cta_text": "🎮 Duel now!",
  "show_bonus_banner": false,
  "bonus_banner_text": "🔥 2x XP este fin de semana!"
}
```

**`premium_modal_config`**
```json
{
  "title": "Heeal Premium",
  "cta_text": "Suscribirse — 4,99€/mes",
  "show_social_proof": false,
  "show_urgency": false,
  "show_comparison": false
}
```

Los dynamic configs también soportan **reglas con condiciones** (igual que los gates), así que puedes devolver valores diferentes según país, plataforma, segmento, etc.

---

## 5. Crear métricas

Antes de lanzar un experimento necesitas tener las métricas definidas. Statsig soporta 6 tipos:

| Tipo | Qué mide | Ejemplo en Heeal |
|---|---|---|
| **Event Count** | Total de veces que ocurre un evento | Cuántos duelos se jugaron |
| **User Count** | Usuarios únicos que disparan un evento | Usuarios que hicieron su primer duelo |
| **Aggregation** | Suma o promedio de un valor del evento | Revenue total por premium_purchased |
| **Ratio** | Tasa entre dos métricas | Tasa de conversión (compras / vistas del modal) |
| **Funnel** | Conversión paso a paso | Onboarding → primer duelo → compra premium |
| **Count Distinct** | Valores únicos de un campo | Cuántos tipos de workout diferentes |

### Métricas para nuestros experimentos

**Experimento 1 (onboarding):**
- Primaria: `first_duel_completed` → User Count (usuarios únicos que completaron el primer duelo)
- Guardrail: `create_account_completed` → User Count (que no caiga la tasa de registro)

**Experimento 2 (premium):**
- Primaria: `premium_purchased` → User Count (usuarios únicos que compraron premium)
- Guardrail: `premium_modal_dismissed` → Event Count (que no suba el rechazo del modal)

### Crear métricas en la consola

`console.statsig.com → Metrics → Metrics Catalog → Create`

> **Importante**: las métricas solo calculan datos desde su fecha de creación. No hay backfill. Crea las métricas **antes** de lanzar el experimento.

### Tipos de métrica en experimentos

| Rol | Propósito | Cuántas |
|---|---|---|
| **Primary** | Valida la hipótesis. Es la que decide si el test gana o pierde. | 1 (máximo 2) |
| **Secondary** | Explora efectos colaterales que quieres entender. | 2-5 |
| **Guardrail** | Protege métricas de negocio que no deben empeorar. | 1-3 |

> Mantén pocas métricas clave. Más de un puñado indica una hipótesis mal definida.

---

## 6. Crear experimentos

| Experimento | División | Métrica primaria | Evento de tracking |
|---|---|---|---|
| `onboarding_experiment` | 50/50 | User Count de `first_duel_completed` | `first_duel_completed` |
| `premium_experiment` | 50/50 | User Count de `premium_purchased` | `premium_purchased` |

### Configuración paso a paso

1. `console.statsig.com → Experiments → Create`
2. Nombre: `onboarding_experiment`
3. **Allocation**: 50% control / 50% variante
4. **Primary metric**: selecciona la métrica que creaste
5. **Guardrail metrics**: añade las métricas guardrail
6. **Targeting**: puedes limitar por país, OS, app version, o dejar abierto
7. **Start**: lanza cuando todo esté verificado

### Pestañas del experimento en la consola

| Pestaña | Qué muestra |
|---|---|
| **Setup** | Scorecard, allocation, targeting, grupos, parámetros |
| **Diagnostics** | Stream en vivo de logs para verificar la integración |
| **Results** | Datos de exposición y lifts de las métricas del scorecard |
| **Explore** | Query builder para analizar por dimensiones |
| **Summary** | Resumen general del experimento |

---

## 7. Monitorear la salud del experimento

Cuando el experimento está corriendo, revisa el banner de **Experiment Health Checks** en la parte superior del scorecard. Hay 5 checks clave:

| Check | Qué verifica | Alerta |
|---|---|---|
| **Checks started** | El SDK está reportando evaluaciones | Si no aparecen checks tras el lanzamiento |
| **Valid unit type** | Los checks incluyen el ID configurado (userID) | Si el unit ID no coincide |
| **Events have data** | Los eventos tienen el mismo unit ID que las exposiciones | Si las métricas no calculan |
| **Exposures balanced (SRM)** | La distribución entre control y variante es la esperada | Amarillo: p-value 0.001–0.01. Rojo: p-value < 0.001 |
| **No crossover** | Un usuario no fue expuesto a múltiples variantes | Si la tasa supera el 1% |

### ¿Qué es el SRM (Sample Ratio Mismatch)?

Statsig corre un test chi-cuadrado para verificar que la distribución real 50/50 se mantiene. Si hay desbalance significativo, algo está mal en la implementación (por ejemplo, la variante tarda más en cargar y los usuarios rebotan antes de ser contados).

> **Si ves SRM rojo, no leas los resultados**. Primero investiga y corrige la causa.
