# Prompt 2 — Generar el componente ExpressDuelOnboarding

> **Cuándo usarlo:** Para generar la variante experimental del onboarding (Experimento 1).
> **Tiempo estimado de ejecución:** ~20 segundos.

---

## Prompt (copia y pega esto en Claude o en Cursor)

```
Contexto: App React Native (Expo, TypeScript) de fitness gamificada llamada Heeal.
Los usuarios compiten entre sí en duelos de entrenamiento. El sistema de avatares
gamifica el progreso deportivo: entrenar da XP al avatar.

Problema a resolver: el onboarding actual (paso 1: nombre, paso 2: elegir avatar)
tiene una activación del 45%. El 55% de los usuarios que se registran nunca llegan
a hacer su primer duelo, que es donde está la propuesta de valor real de la app.

Objetivo: Generar el componente ExpressDuelOnboarding.tsx.
Este componente es la variante experimental del onboarding. En lugar de pedir
nombre y avatar, muestra directamente un duelo contra un bot para que el usuario
experimente el core loop antes de cualquier fricción de configuración.

Lo que debe mostrar el componente:
1. Un badge superior: "🔥 Duelo exprés"
2. Título: "¿Listo para tu primer duelo?"
3. Subtítulo: "Te hemos emparejado con un rival de tu nivel. Gana 500 XP y desbloquea una skin exclusiva."
4. Una tarjeta del rival con: emoji 🤖, nombre "Bot_Alpha", nivel "Nivel 3 · 1.200 XP"
5. Botón principal: "⚔️ Aceptar duelo" → navega a 'Duel' con navigation.replace
6. Enlace de skip: "Ahora no, gracias" → navega a 'Dashboard' con navigation.replace

Restricciones:
- StyleSheet de React Native (sin librerías de styling externas)
- Paleta de colores de Heeal: fondo #0d0d1a, acento principal #00CC66,
  naranja para urgencia/badges #FF6B00, texto blanco #ffffff, secundario #aaaaaa
- El componente recibe { navigation }: any como prop (React Navigation)
- Usar replace en lugar de navigate para que no se pueda volver al onboarding

Formato de respuesta: componente completo listo para copiar en ExpressDuelOnboarding.tsx.
No incluir explicaciones después del código, solo el componente.
```

---

## Resultado esperado

El componente en `heeal-app/src/screens/ExpressDuelOnboarding.tsx` (ya generado).
Consultar ese archivo como referencia si Claude genera algo que difiere.

---

## Notas para la demo

- Si quieres que el rival sea más humano, cambia el prompt: "rival real de la comunidad (usuario anónimo, nivel 5, 2.300 XP)"
- El `navigation.replace` es intencional: evita que el usuario pueda navegar "atrás" al onboarding
