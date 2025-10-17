import { defineContentConfig, defineCollection } from "@nuxt/content";
import { z } from "zod";

const commonSchema = z.object({
  title: z.string(),
  date: z.string(),
  version: z.string(),
});

export default defineContentConfig({
  collections: {
    // English pages collection
    pages: defineCollection({
      type: "page",
      source: {
        include: "**",
        prefix: "",
      },
      schema: commonSchema,
    }),

  },
});
