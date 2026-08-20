# Configuración de experimentos

## Experimento 1: Onboarding con duelo exprés

**Hipótesis:** Si al registrarse mostramos un duelo instantáneo contra un bot con 500 XP, entonces la activación aumentará del 45% al 65%.

**¿Por qué?** El 55% de los usuarios nunca llega al primer duelo (la propuesta de valor real). Un duelo exprés reduce el time-to-value de ~90s a ~15s, eliminando la fricción de configuración antes de que el usuario experimente el core loop.

### Parámetros del Dynamic Config (`onboarding_config`)

| Parámetro | Control | Variante |
|---|---|---|
| type | classic | express_duel |
| steps | 2 | 1 |
| show_duel | false | true |
| xp_reward | 0 | 500 |

### Feature Gate

`onboarding_express_duel` → controla qué componente renderiza el AppNavigator:
- Gate OFF → `ClassicOnboarding` (nombre + avatar, 2 pasos)
- Gate ON → `ExpressDuelOnboarding` (duelo exprés directo)

### Métricas

| Rol | Métrica | Tipo | Evento |
|---|---|---|---|
| **Primaria** | First duel completion rate | User Count | `first_duel_completed` |
| **Secundaria** | XP ganado en primera sesión | Aggregation (sum) | `first_duel_completed` → metadata `xp_reward` |
| **Guardrail** | Tasa de registro completado | User Count | `create_account_completed` |
| **Guardrail** | Churn día 7 | User Count | Ausencia de eventos en 7 días post-registro |

### Configuración en la consola

1. **Nombre**: `onboarding_experiment`
2. **Allocation**: 50% control / 50% variante
3. **Unit type**: userID
4. **Primary metric**: User Count de `first_duel_completed`
5. **Targeting**: todos los usuarios nuevos (sin filtros adicionales)

**Resultado esperado:** +44% activación (de 45% a 65%)

---

## Experimento 2: Modal premium con social proof

**Hipótesis:** Si mostramos prueba social + urgencia + comparativa Free vs Premium, entonces la conversión a premium aumentará del 3% al 6%.

**¿Por qué?** El modal actual solo lista features sin contexto para decidir. Añadir social proof (12.847 usuarios), urgencia (3 días gratis) y una comparativa visual reduce la incertidumbre del usuario frente a la decisión de pago.

### Parámetros del Dynamic Config (`premium_modal_config`)

| Parámetro | Control | Variante |
|---|---|---|
| title | Heeal Premium | Únete a 12.847 usuarios |
| cta_text | Suscribirse — 4,99€/mes | Comenzar prueba gratis → |
| show_social_proof | false | true |
| show_urgency | false | true |
| show_comparison | false | true |

### Feature Gate

`premium_social_proof` → controla si el Dashboard muestra los elementos adicionales del modal:
- Gate OFF → Modal simple con título y CTA básicos (valores del config con defaults)
- Gate ON → Modal con social proof badge, tabla comparativa y texto de urgencia

### Métricas

| Rol | Métrica | Tipo | Evento |
|---|---|---|---|
| **Primaria** | Premium conversion rate | User Count | `premium_purchased` |
| **Secundaria** | Revenue por usuario | Aggregation (sum) | `premium_purchased` → metadata `plan` |
| **Secundaria** | Modal views | Event Count | `premium_modal_viewed` |
| **Guardrail** | Modal dismiss rate | Ratio | `premium_modal_dismissed` / `premium_modal_viewed` |
| **Guardrail** | Engagement post-modal | User Count | Cualquier evento en los 30 min posteriores al dismiss |

### Configuración en la consola

1. **Nombre**: `premium_experiment`
2. **Allocation**: 50% control / 50% variante
3. **Unit type**: userID
4. **Primary metric**: User Count de `premium_purchased`
5. **Targeting**: usuarios con al menos 1 duelo completado (para medir conversión en usuarios activados)

**Resultado esperado:** +100% conversión (de 3% a 6%)

---

## Cómo leer los resultados

Cuando el experimento haya acumulado suficientes exposiciones, ve a la pestaña **Results** en la consola.

### Métricas clave en el scorecard

| Métrica | Qué significa | Qué buscar |
|---|---|---|
| **Lift (%)** | Diferencia porcentual de la variante vs control | Positivo = la variante mejoró |
| **P-value** | Probabilidad de que el resultado sea casualidad | < 0.05 = estadísticamente significativo |
| **Confidence Interval** | Rango donde está el efecto real (95% de confianza) | Si NO cruza cero → resultado significativo |
| **Exposures** | Usuarios asignados a cada grupo | Deben estar balanceados (revisar SRM) |

### Reglas para tomar la decisión

| Escenario | Acción |
|---|---|
| Lift positivo + p-value < 0.05 + guardrails OK | **Ganador** → promocionar la variante |
| Lift negativo + p-value < 0.05 | **Perdedor** → descartar, investigar por qué |
| P-value > 0.05 tras suficiente muestra | **Inconcluso** → decidir si iterar o cerrar |
| Guardrail empeoró significativamente | **Pausar** → investigar aunque la primaria mejore |
| SRM detectado (rojo) | **No leer resultados** → corregir la implementación primero |

### Errores comunes al interpretar resultados

- **Cherry-picking**: destacar métricas favorables e ignorar las desfavorables
- **Parar antes de tiempo**: leer resultados antes de tener suficiente muestra da falsos positivos
- **Falsos positivos por volumen**: con un intervalo de confianza del 95% y 20 métricas, espera ~1 resultado significativo por puro azar
- **Confundir ratio con absoluto**: una tasa de conversión puede subir mientras las conversiones absolutas bajan (si el denominador cayó)

> **Regla de oro**: un resultado estadísticamente significativo debe tener una **explicación plausible**. Si el lift no tiene sentido lógico, probablemente es un falso positivo.
