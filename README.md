# datav-base

База для data-экранов (data screens / 数据大屏): один движок эффектов на чистом TypeScript — `@dv/core` — и два тонких компонентных набора с одинаковыми API: `@dv/react` (React 19) и `@dv/vue` (Vue 3). Вся логика эффектов написана один раз в core; оболочки занимаются только жизненным циклом и props.

## Структура

```
packages/
  core/    @dv/core  — чистый TS, ноль зависимостей от фреймворков:
                       canvas/WebGL-эффекты, автоподгонка макета, темы, builders опций ECharts
  react/   @dv/react — React 19 компоненты (тонкие оболочки)
  vue/     @dv/vue   — Vue 3 компоненты + плагин install()
apps/
  react-demo/        — Vite 8 демо-экран (dev: pnpm dev:react)
  vue-demo/          — Vite 8 демо-экран (dev: pnpm dev:vue)
  pages-landing/     — лендинг для GitHub Pages
```

## Компоненты (одинаковые имена и props в обеих библиотеках)

| Группа | Компоненты |
|---|---|
| Макет | `DvFullScreenContainer` (autofit-подгонка под экран) |
| Цифры и текст | `DvDigitalFlop`, `DvTypewriter`, `DvMarqueeText`, `DvFlipClock`, `DvGlitchText`, `DvTrendValue` |
| Рамки и декор | `DvBorderBox` (варианты box1–box13), `DvDecoration1`–`DvDecoration10` |
| Данные | `DvScrollBoard`, `DvScrollRanking`, `DvCapsuleChart`, `DvConicalChart`, `DvPercentRing`, `DvGauge`, `DvWaterLevelPond` |
| Графики | `DvChart` (ECharts 6, тема dv-dark), builders `dvRadarOption` / `dvFunnelOption` / `dvSankeyOption` |
| Карты | `DvFlylineMap` (нормализованные и lat/lng координаты), `DvGeoMap` (GeoJSON + клик-выбор региона), `DvGlobe` (WebGL, три точки и дуги) |
| Состояния | `DvLoading`, `DvAlert`, `DvTiltCard` |
| Фоны | `DvPlexus` |
| Хелперы | `useCanvasEffect` (React hook / Vue composable) |

## Опциональные зависимости

Библиотеки не тащат тяжёлые зависимости — ставите только то, что используете:

- `echarts` ^6 — нужен для `DvChart` и option-builders
- `three` ^0.180 — нужен для `DvGlobe`

## Быстрый старт

```bash
pnpm install
pnpm dev:react   # React-демо на :5173
pnpm dev:vue     # Vue-демо на :5174
pnpm build       # сборка всех пакетов
pnpm typecheck   # проверка типов (последовательно, vue-tsc)
```

### React

```tsx
import { DvFullScreenContainer, DvDigitalFlop, DvBorderBox, DvChart } from "@dv/react";

<DvFullScreenContainer designWidth={1920} designHeight={1080}>
  <DvBorderBox variant="box3">
    <DvDigitalFlop value={12890435} />
  </DvBorderBox>
</DvFullScreenContainer>
```

### Vue

```vue
<script setup>
import { DvFullScreenContainer, DvBorderBox, DvDigitalFlop } from "@dv/vue";
</script>

<template>
  <DvFullScreenContainer :design-width="1920" :design-height="1080">
    <DvBorderBox variant="box3"><DvDigitalFlop :value="12890435" /></DvBorderBox>
  </DvFullScreenContainer>
</template>
```

Глобально: `app.use(DvVue)` регистрирует все компоненты.

## Примечания по стеку

- Библиотечные пакеты поставлены на `typescript ~5.9.3`: `rolldown-plugin-dts` и `vue-tsc` пока требуют классический JS-API компилятора. TypeScript 7 используется на уровне приложений.
- Демо используют alias `@dv/*` → `packages/*/src`, поэтому правки библиотек видны по hot-reload без сборки.
- CI: `.github/workflows/ci-pages.yml` собирает и типизирует на каждый push/PR, а ветку `main` выкладывает на GitHub Pages (`/react/`, `/vue/`).

## License

MIT
