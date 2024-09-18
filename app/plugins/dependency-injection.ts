import { loadDependencies } from "~/dependency-injection/load-di";
import { createSignupFlowsDependencyInjection } from "~/modules/signup-flows/infra/SignupFlowsDependencyInjection";

export default defineNuxtPlugin({
  name: "dependency-injection",
  async setup(_nuxtApp) {
    const commonDependencies = await loadDependencies();
    const signupFlowsDependencies = createSignupFlowsDependencyInjection();

    return {
      provide: {
        dependencies: {
          common: commonDependencies,
          signupFlows: signupFlowsDependencies,
        },
      },
    };
  },
});
