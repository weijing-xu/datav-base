import type { App } from "vue";
import DvAlert from "./components/DvAlert.vue";
import DvBorderBox from "./components/DvBorderBox.vue";
import DvChart from "./components/DvChart.vue";
import DvDecoration1 from "./components/DvDecoration1.vue";
import DvDecoration2 from "./components/DvDecoration2.vue";
import DvDecoration3 from "./components/DvDecoration3.vue";
import DvDecoration4 from "./components/DvDecoration4.vue";
import DvDecoration5 from "./components/DvDecoration5.vue";
import DvDecoration6 from "./components/DvDecoration6.vue";
import DvDecoration7 from "./components/DvDecoration7.vue";
import DvCapsuleChart from "./components/DvCapsuleChart.vue";
import DvDigitalFlop from "./components/DvDigitalFlop.vue";
import DvFlipClock from "./components/DvFlipClock.vue";
import DvMarqueeText from "./components/DvMarqueeText.vue";
import DvPercentRing from "./components/DvPercentRing.vue";
import DvTypewriter from "./components/DvTypewriter.vue";
import DvFlylineMap from "./components/DvFlylineMap.vue";
import DvFullScreenContainer from "./components/DvFullScreenContainer.vue";
import DvLoading from "./components/DvLoading.vue";
import DvScrollBoard from "./components/DvScrollBoard.vue";
import DvScrollRanking from "./components/DvScrollRanking.vue";
import DvWaterLevelPond from "./components/DvWaterLevelPond.vue";

export { useCanvasEffect } from "./composables/useCanvasEffect";

export {
  DvAlert,
  DvBorderBox,
  DvChart,
  DvDecoration1,
  DvDecoration2,
  DvDecoration3,
  DvDecoration4,
  DvDecoration5,
  DvDecoration6,
  DvDecoration7,
  DvCapsuleChart,
  DvDigitalFlop,
  DvFlipClock,
  DvFlylineMap,
  DvFullScreenContainer,
  DvLoading,
  DvMarqueeText,
  DvPercentRing,
  DvScrollBoard,
  DvScrollRanking,
  DvTypewriter,
  DvWaterLevelPond,
};

const components = {
  DvAlert,
  DvBorderBox,
  DvChart,
  DvDecoration1,
  DvDecoration2,
  DvDecoration3,
  DvDecoration4,
  DvDecoration5,
  DvDecoration6,
  DvDecoration7,
  DvCapsuleChart,
  DvDigitalFlop,
  DvFlipClock,
  DvFlylineMap,
  DvFullScreenContainer,
  DvLoading,
  DvMarqueeText,
  DvPercentRing,
  DvScrollBoard,
  DvScrollRanking,
  DvTypewriter,
  DvWaterLevelPond,
};

/** `app.use(DvVue)` registers every component globally. */
export function install(app: App) {
  for (const [name, component] of Object.entries(components)) {
    app.component(name, component);
  }
}

export default { install };
