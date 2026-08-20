# Prompt 1 — Integrar el SDK de Statsig en la app

> **Cuándo usarlo:** Cuando partes de una app React Native / Expo nueva y necesitas integrar Statsig desde cero.
> **Tiempo estimado de ejecución:** Claude lo resuelve en ~30 segundos.

---

## Prompt (copia y pega esto en Claude o en Cursor)

```
Tengo una app React Native con Expo (TypeScript). Necesito integrar el SDK de Statsig
para usar feature flags, remote config y experimentos A/B.

Contexto de la app:
- App de fitness gamificada llamada Heeal
- Entry point: App.tsx con un componente funcional simple
- Navegación con React Navigation (createNativeStackNavigator)
- El usuario tiene un ID anónimo generado localmente (no hay auth todavía)

Lo que necesito:
1. Instala el SDK con el comando exacto: @statsig/js-client y @statsig/react-bindings
2. Genera un archivo src/config/statsig.ts con la API key como constante exportable
   (usa 'YOUR_STATSIG_CLIENT_KEY' como placeholder)
3. Genera App.tsx modificado que:
   - Cree un StatsigClient con un userID aleatorio (Math.random)
   - Inicialice el cliente con initializeAsync() en un useEffect
   - Muestre un ActivityIndicator mientras el cliente inicializa
   - Envuelva la navegación en <StatsigProvider client={...}>

Restricciones:
- Solo usar @statsig/js-client y @statsig/react-bindings (no la versión antigua statsig-react-native)
- El cliente debe inicializarse una sola vez (fuera del componente)
- Manejar el estado de carga con useState(false) → true al resolver

Formato de respuesta: primero el comando de instalación, luego statsig.ts, luego App.tsx completo.
```

---

## Resultado esperado

Claude debe generar:

**1. Comando de instalación:**
```bash
npx expo install @statsig/js-client @statsig/react-bindings
```

**2. `src/config/statsig.ts`:**
```ts
export const STATSIG_CLIENT_KEY = 'YOUR_STATSIG_CLIENT_KEY';
```

**3. `App.tsx`** con StatsigProvider envolviendo la navegación (ver App.tsx del proyecto como referencia).

---

## Notas para la demo

- Sustituir `'YOUR_STATSIG_CLIENT_KEY'` con la clave real de Statsig (Client SDK Key, no Server Key)
- El `userID` aleatorio es suficiente para la demo; en producción vendría del sistema de autenticación
