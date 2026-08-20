# Prompt 4 — Conectar el feature gate al AppNavigator

> **Cuándo usarlo:** Para conectar el feature flag de Statsig al punto de decisión del onboarding.
> **Este es el PR que hace el equipo de dev una sola vez.**

---

## Prompt (copia y pega esto en Claude o en Cursor)

```
Contexto: App React Native (Expo, TypeScript) con React Navigation.
Tenemos dos versiones del onboarding:
- ClassicOnboarding.tsx: el onboarding clásico (nombre + avatar, 2 pasos)
- ExpressDuelOnboarding.tsx: variante experimental (duelo exprés inmediato)

La app ya tiene Statsig integrado con StatsigProvider en App.tsx.

Objetivo: Modificar AppNavigator.tsx para que el feature gate 'onboarding_express_duel'
de Statsig decida qué onboarding mostrar a cada usuario.

Comportamiento esperado:
- Si el gate está activo para el usuario → mostrar ExpressDuelOnboarding
- Si el gate está inactivo → mostrar ClassicOnboarding (comportamiento por defecto)

Implementación:
- Usar useFeatureGate('onboarding_express_duel') de @statsig/react-bindings
- La consulta debe hacerse dentro del componente AppNavigator

Restricciones:
- No crear un archivo nuevo — solo modificar AppNavigator.tsx
- El nombre de la ruta puede ser 'Onboarding' (genérico)
- Mantener las rutas 'Dashboard' y 'Duel' sin cambios

Formato de respuesta: AppNavigator.tsx completo modificado.
Incluir un comentario corto explicando la lógica del gate (1 línea máximo).
```

---

## Resultado esperado

```tsx
const { value: showExpressDuel } = useFeatureGate('onboarding_express_duel');

<Stack.Screen
  name="Onboarding"
  component={showExpressDuel ? ExpressDuelOnboarding : ClassicOnboarding}
/>
```

---

## Por qué este PR es "el único"

Una vez que este cambio está en producción, el Growth Manager puede activar/desactivar el experimento, cambiar el porcentaje de usuarios, segmentar por país o plataforma — todo desde Statsig, sin que dev intervenga.
