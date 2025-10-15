export default function (type: "api" | "tracking", at: "client" | "server" | null = null): string {
  const config = useRuntimeConfig();
  const siteStore = useSiteStore();

  const isServer = import.meta.server;
  if (isServer && at !== "client") {
    return config.public.apiBaseUrlServer;
  }

  const clientHost = ((): string => {
    switch (type) {
      case "api":
        return siteStore.currentDomain.api;

      case "tracking":
        return siteStore.currentDomain.tracking;
    }
  })();

  const protocol = clientHost.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${clientHost}`;
};
