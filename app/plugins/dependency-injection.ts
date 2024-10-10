import { loadDependencies } from "~/dependency-injection/load-di";
import { createGamesDependencyInjection } from "~/modules/games/infra/GamesDependencyInjection";
import { createSignupFlowsDependencyInjection } from "~/modules/signup-flows/infra/SignupFlowsDependencyInjection";
import { createUsersDependencyInjection } from "~/modules/users/infra/UsersDependencyInjection";

export default defineNuxtPlugin({
  name: "dependency-injection",
  async setup(_nuxtApp) {
    const config = useRuntimeConfig();

    const commonDependencies = await loadDependencies();

    return {
      provide: {
        dependencies: {
          common: commonDependencies,
          signupFlows: createSignupFlowsDependencyInjection(config.public, commonDependencies),
          games: await createGamesDependencyInjection(config.public, commonDependencies),
          users: await createUsersDependencyInjection(commonDependencies),
        },
      },
    };
  },
});
