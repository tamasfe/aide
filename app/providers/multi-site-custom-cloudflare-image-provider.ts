/**
 *
 * This code was copied from the official Cloudflare provider (at https://github.com/nuxt/image/blob/main/src/runtime/providers/cloudflare.ts)
 * and modified to support our multi-site setup by using the CDN domain from the current site store.
 */

import { encodeQueryItem, joinURL } from "ufo";
import type { ProviderGetImage } from "@nuxt/image";
import { createOperationsGenerator } from "#image";

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: "w",
    height: "h",
    dpr: "dpr",
    fit: "fit",
    gravity: "g",
    quality: "q",
    format: "f",
    sharpen: "sharpen",
  },
  valueMap: {
    fit: {
      cover: "cover",
      contain: "contain",
      fill: "scale-down",
      outside: "crop",
      inside: "pad",
    },
    gravity: {
      auto: "auto",
      side: "side",
    },
  },
  joinWith: ",",
  formatter: (key, value) => encodeQueryItem(key, value),
});

const defaultModifiers = {};

// https://developers.cloudflare.com/images/image-resizing/url-format/
export const getImage: ProviderGetImage = (
  src,
  { modifiers = {} } = {},
) => {
  const mergeModifiers = { ...defaultModifiers, ...modifiers };
  // @ts-expect-error Copy pasted all of this from the current cloudflare code. Should work
  const operations = operationsGenerator(mergeModifiers);

  const siteStore = useSiteStore();

  const baseUrl = `https://${siteStore.currentDomain.cdn}`;

  // https://<ZONE>/cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>
  const url = operations ? joinURL(baseUrl, "cdn-cgi/image", operations, src) : src;

  return {
    url,
  };
};
