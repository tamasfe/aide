import path from "path";
import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    setupFiles: [path.join("../", "test/integration/helpers/setup-18n.ts")],
  },
});
