# Prompt 3 — Generar el modal premium con social proof

> **Cuándo usarlo:** Para generar la variante experimental del modal de conversión a premium (Experimento 2).
> **Tiempo estimado de ejecución:** ~25 segundos.

---

## Prompt (copia y pega esto en Claude o en Cursor)

```
Contexto: App React Native (Expo, TypeScript) de fitness gamificada llamada Heeal.
El modelo de negocio es freemium: plan gratuito con límites (2 duelos/semana, 3 meses
de historial) y plan premium a 4,99€/mes con todo ilimitado.

Problema a resolver: la conversión a premium es del 3%. El modal actual muestra solo
una lista de features ("duelos ilimitados", "historial completo", "avatares exclusivos").
Los usuarios no convierten porque no tienen contexto suficiente para decidir.

Objetivo: Añadir la lógica del modal premium con social proof a Dashboard.tsx.
El modal debe leer su configuración desde Statsig (useDynamicConfig) para que
el Growth Manager pueda modificarla sin nuevo deploy.

Lo que debe mostrar el modal cuando está en la variante experimental:
1. Badge de social proof: "⭐ 4.8 · 12.847 usuarios premium"
2. Título dinámico (desde config): "Únete a 12.847 usuarios premium"
3. Subtítulo: "Desbloquea todo el potencial de Heeal"
4. Comparativa Free vs Premium con 3 filas
5. CTA dinámico (desde config): "Comenzar prueba gratis →"
6. Texto de urgencia: "⏰ 3 días gratis · Oferta por tiempo limitado"
7. Link de dismiss: "Seguir en free"

Integración con Statsig:
- Feature gate: useFeatureGate('premium_social_proof')
- Dynamic config: useDynamicConfig('premium_modal_config')
- Log de evento: client.logEvent('premium_purchased', { source: 'modal', variant: ... })

Restricciones:
- StyleSheet de React Native, sin librerías externas
- Paleta: fondo del modal #1a1a2e, acento #00CC66, urgencia #FF6B00

Formato de respuesta: solo las partes que cambian en Dashboard.tsx.
```

---

## Resultado esperado

Las líneas de `config.get(...)` y el JSX del modal ya están en `heeal-app/src/screens/Dashboard.tsx`.
Consultar ese archivo como referencia.

---

## Notas para la demo

- Mostrar primero el modal en "control" (todos los parámetros en false) y después en "variante" para que el contraste sea visible
- El evento `premium_purchased` es el que Statsig usa para calcular el lift del experimento
