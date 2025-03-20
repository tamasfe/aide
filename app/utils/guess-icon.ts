export const guessCategoryIcon = (categoryIdentifier: string): string => {
  switch (categoryIdentifier) {
    case "your-top-picks":
      return "emojione-v1:heart-suit";
    case "latest-releases":
      return "emojione-v1:rocket";
      // case "lobby":
      //   return "lucide:home";
      // case "slots":
      //   return "lucid:coins";
      // case "roulette":
      //   return "lucid:roulette";

      // case "crash":
      //   return "lucid:crash";
      // case "live":
      //   return "lucid:live";
      // case "table":
      //   return "lucid:table";

    default:
      return ["emojione-v1:candy", "emojione-v1:slot-machine", "emojione-v1:fire", "emojione-v1:up-arrow", "emojione-v1:eight-spoked-asterisk", "emojione-v1:confetti-ball", "emojione-v1:alien"].sort(() => Math.random() - 0.5)[0] as string;
  }
};
