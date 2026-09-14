# Mi Dinero 💶

App de control de dinero para adolescentes, hecha con **React Native + Expo**.
Componentes nativos de iOS, teclado nativo, gestos nativos — no es una web disfrazada.

## 1. Verla en tu iPhone ahora mismo (gratis, sin cuenta de desarrollador)

Necesitas **Node.js** instalado (LTS, desde nodejs.org).

1. Clona el repositorio y entra en la carpeta.
2. Instala las dependencias:
   ```
   npm install
   ```
3. Arranca el proyecto:
   ```
   npx expo start
   ```
4. En tu iPhone, instala la app gratuita **Expo Go** desde la App Store.
5. Abre la Cámara del iPhone y escanea el código QR que aparece en la terminal.
6. Se abrirá la app, de verdad, en tu iPhone. Los cambios en el código se recargan solos.

Los datos (presupuesto, gastos, metas) se guardan en el propio dispositivo con `AsyncStorage`.

## 2. Tener una app instalable de verdad (icono en la pantalla de inicio, sin Expo Go)

Se compila en la nube de Expo (EAS Build), no hace falta Mac:

```
npm install -g eas-cli
eas login
eas build --platform ios --profile preview
```

## 3. Subirla a la App Store

Hace falta una cuenta de **Apple Developer Program** (99 $/año) y ejecutar `eas submit --platform ios`.

## Estructura del proyecto

```
App.js
src/
  theme.js                 — colores y radios
  utils.js                 — cálculo del presupuesto diario y formato de fechas/dinero
  storage.js                — persistencia con AsyncStorage
  components/
    ProgressRing.js
    TabBar.js
    Sheet.js
    ExpenseModal.js
    GoalModal.js
    ContributeModal.js
    BudgetModal.js
  screens/
    OnboardingScreen.js
    HomeScreen.js
    ExpensesScreen.js
    GoalsScreen.js
    SettingsScreen.js
```

## Cómo funciona el cálculo del día a día

```
disponible = presupuesto_total - gastado_hasta_hoy - apartado_en_metas
presupuesto_de_hoy = disponible / días_que_quedan (incluyendo hoy)
```

Como el gasto de hoy ya está descontado antes de dividir, el número que ves es justo lo que queda por gastar hoy. Si un día te pasas, al día siguiente el reparto se recalcula solo.
