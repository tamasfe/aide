export default function () {
  const { params } = useRoute();

  const identifier = computed(() => {
    const providerSlug = params.provider;
    const gameSlug = params.game;

    if (!providerSlug || !gameSlug || typeof providerSlug !== "string" || typeof gameSlug !== "string") {
      throw new Error("Game slug route parameter is missing");
    }

    if (!providerSlug || !gameSlug) {
      throw new Error(`Invalid game identifier from "${providerSlug}" & "${gameSlug}"`);
    }
    return `${providerSlug}/${gameSlug}`;
  });

  return identifier;
}
