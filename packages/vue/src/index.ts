import type { App } from "vue";
import DvDecoration1 from "./components/DvDecoration1.vue";
import DvDigitalFlop from "./components/DvDigitalFlop.vue";
import DvFullScreenContainer from "./components/DvFullScreenContainer.vue";

export { DvDecoration1, DvDigitalFlop, DvFullScreenContainer };

const components = { DvDecoration1, DvDigitalFlop, DvFullScreenContainer };

/** `app.use(DvVue)` registers every component globally. */
export function install(app: App) {
  for (const [name, component] of Object.entries(components)) {
    app.component(name, component);
  }
}

export default { install };
