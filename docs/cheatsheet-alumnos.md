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

---

## Los 3 conceptos de Statsig

| Concepto | Qué es | Analogía | Cuándo usar |
|---|---|---|---|
| **Feature Gate** | Booleano on/off por usuario | El portero del edificio | Necesitas decidir si un usuario ve o no algo |
| **Dynamic Config** | JSON remoto con parámetros | El mando a distancia del TV | Necesitas cambiar textos, números o configuración sin deploy |
| **Experiment** | Asignación aleatoria a control/variante | Un test clínico controlado | Necesitas medir el impacto causal de un cambio |

### ¿Gate o Experiment?

| | Gate | Experiment |
|---|---|---|
| Variantes | 2 (pass/fail) | Cualquier número |
| Retorno | Booleano | JSON con parámetros |
| Tráfico | Pass % ajustable (1%-99%) | Allocation % + split equitativo |
| Para qué | Rollout gradual, kill switch | Comparar variantes, medir impacto |

**En la práctica se combinan**: el gate filtra la audiencia → el experiment asigna a control/variante → si gana, subes el gate al 100%.

### Patrón de canary rollout

```
0% → 2% → 10% → 50% → 100%
```

En cada paso, revisa métricas de usuario y sistema antes de avanzar.

---

## APIs de Statsig que usarás

### Feature Gates (la puerta)
```tsx
const { value } = useFeatureGate('gate_name');
// value === true  → el usuario ve la nueva experiencia
// value === false → el usuario ve la versión original
```

### Dynamic Config (el mando a distancia)
```tsx
const config = useDynamicConfig('config_name');
const color = config.get('button_color', '#default');
const time  = config.get('time_limit', 30) as number;
const show  = config.get('show_banner', false) as boolean;
const text  = config.get('banner_text', 'Hola!') as string;
```

> **Límite**: el payload de un dynamic config no puede superar 100kb.

### Log de eventos (para medir)
```tsx
const { client } = useStatsigClient();

// Evento simple
client.logEvent('button_click');

// Con valor numérico + metadata
client.logEvent('purchase_completed', 29.99, { product_id: 'premium_monthly' });

// Los eventos que usamos en Heeal
client.logEvent('first_duel_completed', { score: 42, time_limit: 30, xp_reward: 500 });
client.logEvent('premium_purchased', { source: 'modal', variant: 'social_proof', plan: 'annual' });
```

### Ciclo de vida del SDK
```tsx
// Apagar el SDK al cerrar la app (asegura que los eventos se envían)
useEffect(() => {
  return () => { void client.shutdown(); };
}, [client]);
```

---

## Cómo funcionan las reglas de un Feature Gate

Statsig evalúa las reglas **de arriba a abajo**. El usuario cae en la primera que cumple.

```
Regla 1: email contiene "@producthackers.com" → 100% pass  (equipo interno)
Regla 2: país = "ES"                         →  50% pass  (rollout gradual)
Regla 3: todos los demás                     →   0% pass  (todavía no)
```

**Tipos de condición disponibles:**

| Categoría | Ejemplos |
|---|---|
| Identidad | User ID, email, unit ID |
| Dispositivo | OS, browser, app version, device model |
| Geografía | País (por IP), IP address |
| Lógica | Pasa otro gate, falla otro gate, usuario en segmento |
| Custom | Cualquier campo que envíes en el user object |
| Temporal | Antes de fecha, después de fecha |

**Estabilidad**: la evaluación es determinista por userID. Un usuario siempre obtiene el mismo resultado salvo que hagas *resalting*.

**Overrides**: puedes forzar pass/fail para usuarios específicos desde la consola (útil para QA). No se cuentan en el análisis.

---

## Tipos de métricas en Statsig

| Tipo | Qué mide | Ejemplo |
|---|---|---|
| **Event Count** | Total de ocurrencias de un evento | Cuántos duelos se jugaron |
| **User Count** | Usuarios únicos que disparan un evento | Cuántos usuarios hicieron su primer duelo |
| **Aggregation** | Suma o promedio de un valor del evento | Revenue total |
| **Ratio** | Tasa entre dos métricas | Conversión = compras / vistas |
| **Funnel** | Conversión paso a paso | Onboarding → duelo → compra |
| **Count Distinct** | Valores únicos de un campo | Tipos de workout diferentes |

### Roles de métricas en un experimento

| Rol | Propósito | Cuántas |
|---|---|---|
| **Primary** | Decide si el test gana o pierde | 1 (máx. 2) |
| **Secondary** | Explora efectos que quieres entender | 2-5 |
| **Guardrail** | Protege métricas que no deben empeorar | 1-3 |

> ⚠️ Las métricas solo calculan desde su fecha de creación. **Créalas antes de lanzar el experimento.**

---

## Cómo leer resultados

| Métrica | Qué significa | Referencia |
|---|---|---|
| **Lift (%)** | Diferencia porcentual variante vs control | Positivo = mejora |
| **P-value** | Probabilidad de que sea casualidad | < 0.05 = significativo |
| **Confidence Interval** | Rango del efecto real (95% confianza) | Si no cruza cero → significativo |

### Decisiones

| Escenario | Acción |
|---|---|
| Lift + significativo + guardrails OK | **Ganador** → promocionar |
| Lift − significativo | **Perdedor** → descartar |
| No significativo tras suficiente muestra | **Inconcluso** → iterar o cerrar |
| Guardrail empeoró | **Pausar** → investigar |

### Health checks del experimento

| Check | Qué verifica |
|---|---|
| **SRM** (Sample Ratio Mismatch) | ¿La distribución 50/50 es real? Si no → la implementación tiene un bug |
| **Crossover** | ¿Usuarios viendo múltiples variantes? > 1% = problema |
| **Events have data** | ¿Los eventos usan el mismo unit ID que las exposiciones? |

> **Si ves SRM rojo, no leas los resultados.** Primero corrige la causa.

---

## Estructura de un prompt efectivo

| Sección | Qué incluir |
|---|---|
| **Contexto** | Qué app, qué tecnología, qué problema |
| **Objetivo** | Qué quiero que genere |
| **Restricciones** | Librerías, convenciones, paleta de colores |
| **Formato** | Qué quiero como output (componente completo, solo diff, etc.) |

### Ejemplo real (live coding de la sesión):
> "Tengo una app de fitness en React Native (Expo). El archivo DuelScreen.tsx
> ya está conectado a Statsig con useDynamicConfig('duel_config').
> Necesito agregar un banner condicional controlado por show_bonus_banner (bool)
> que muestre el texto de bonus_banner_text. Aparece entre vsCard y rewardBadge.
> Estilo: borde verde #BBF246, fondo oscuro, borderRadius 12.
> Solo dame el código a agregar. Sin explicaciones."

---

## Flujo para lanzar un experimento

1. Hipótesis + métrica primaria
2. Crear métricas en Statsig (antes de lanzar)
3. Generar componente con Cursor/Claude
4. Envolver en `useFeatureGate()`
5. Conectar a `useDynamicConfig()`
6. Configurar experimento en Statsig (allocation, métricas, targeting)
7. Verificar health checks (SRM, crossover, events)
8. Leer resultados (lift, p-value, confianza)
9. Promocionar ganador o descartar
10. Limpiar el flag y el código condicional

### Después del test

| Si ganó la variante | Si perdió o fue inconcluso |
|---|---|
| Gate al 100% → todos ven la variante | Gate al 0% → desactivar |
| Actualizar Dynamic Config con valores ganadores | Documentar el learning |
| Cerrar el experimento | Formular nueva hipótesis |
| Eliminar lógica condicional del código | Limpiar código de la variante |
| Borrar el gate de la consola | Borrar el gate de la consola |

---

## Buenas prácticas

✅ Prefijos en nombres: `exp_onboarding_express_duel`
✅ Un propósito por flag (no controlar múltiples features con un solo gate)
✅ Fecha de expiración en cada flag
✅ Limpiar flags al terminar (eliminar del código Y de la consola)
✅ Remote Config para todo lo mutable (texto, números, colores)
✅ Gatear código nuevo aunque no esté listo (deploy inactivo, activa cuando esté OK)
✅ Ship en main con el gate apagado — evita branches largos
✅ Definir hipótesis y métricas ANTES de mirar resultados
✅ Pocas métricas clave (más de 5 = hipótesis difusa)

❌ Anidar flags entre sí
❌ Hardcodear valores en el código
❌ Lanzar sin métrica definida
❌ Dejar flags muertos en producción
❌ Parar el test antes de tener suficiente muestra
❌ Cherry-pickear métricas favorables ignorando las demás

---

## Configuración de claves Statsig

| Clave | Para qué | Dónde va |
|---|---|---|
| `client-...` | SDK en la app (leer gates/configs) | `src/config/statsig.ts` |
| `console-...` | API y MCP (crear/modificar configs) | Variables de entorno / MCP config |

**Dónde obtener la Console API Key:**
`console.statsig.com → Settings → Keys & Environments → Console API Keys`

---

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

---

## Herramientas para el live coding

| Herramienta | Modelo | Acceso |
|---|---|---|
| Antigravity IDE | Gemini (Google Suite) | Google Workspace |
| Cursor | Claude / GPT-4 | Pago personal |
| claude.ai | Claude | Pago personal |

**Para la demo:** Antigravity con Gemini es suficiente para generar integraciones de Statsig en React Native.
