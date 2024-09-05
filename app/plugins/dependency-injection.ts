import { loadDependencies } from "~/dependency-injection/load-di";

export default defineNuxtPlugin({
  name: "dependency-injection",
  async setup(_nuxtApp) {
    const dependencies = await loadDependencies();

    return {
      provide: {
        dependencies,
      },
    };
  },
});
