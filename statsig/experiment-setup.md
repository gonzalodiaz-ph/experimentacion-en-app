# Configuración de experimentos

## Experimento 1: Onboarding con duelo exprés
**Hipótesis:** Si al registrarse mostramos un duelo instantáneo contra un bot con 500 XP, entonces la activación aumentará del 45% al 65%.

| Parámetro | Control | Variante |
|---|---|---|
| type | classic | express_duel |
| steps | 2 | 1 |
| show_duel | false | true |
| xp_reward | 0 | 500 |

**Resultado esperado:** +44% activación

## Experimento 2: Modal premium con social proof
**Hipótesis:** Si mostramos prueba social + urgencia + comparativa, entonces la conversión a premium aumentará del 3% al 6%.

| Parámetro | Control | Variante |
|---|---|---|
| title | Heeal Premium | Únete a 12.847 usuarios |
| cta_text | Suscribirse — 4,99€/mes | Comenzar prueba gratis → |
| show_social_proof | false | true |
| show_urgency | false | true |
| show_comparison | false | true |

**Resultado esperado:** +100% conversión
