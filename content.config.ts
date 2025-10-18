import { defineContentConfig, defineCollection } from "@nuxt/content";
import { z } from "zod";

const commonSchema = z.object({
  title: z.string(),
  date: z.string(),
  version: z.string(),
});

export default defineContentConfig({
  collections: {
    terms_pages: defineCollection({
      type: "page",
      source: {
        include: "terms_pages/**",
        prefix: "",
      },
      schema: commonSchema,
    }),

  },
});
