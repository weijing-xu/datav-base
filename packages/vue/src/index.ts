import type { App } from "vue";
import DvBorderBox from "./components/DvBorderBox.vue";
import DvDecoration1 from "./components/DvDecoration1.vue";
import DvDigitalFlop from "./components/DvDigitalFlop.vue";
import DvFullScreenContainer from "./components/DvFullScreenContainer.vue";
import DvScrollBoard from "./components/DvScrollBoard.vue";

export { DvBorderBox, DvDecoration1, DvDigitalFlop, DvFullScreenContainer, DvScrollBoard };

const components = {
  DvBorderBox,
  DvDecoration1,
  DvDigitalFlop,
  DvFullScreenContainer,
  DvScrollBoard,
};

/** `app.use(DvVue)` registers every component globally. */
export function install(app: App) {
  for (const [name, component] of Object.entries(components)) {
    app.component(name, component);
  }
}

export default { install };
