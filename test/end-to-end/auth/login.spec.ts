import { setup, createPage } from "@nuxt/test-utils/e2e";
import { describe, it, expect } from "vitest";

describe("Homepage login", async () => {
  await setup({
    // test context options
    browserOptions: {
      type: "chromium",
    },
  });

  it(
    "opens login modal when clicking login button in app header",
    { timeout: 10000 },
    async () => {
      const page = await createPage("/");

      expect(await page.isVisible("#app-header-login-button")).toBe(true);
      await page.click("#app-header-login-button");

      expect(await page.isVisible("#base-modal-login")).toBe(true);
    },
  );
});
