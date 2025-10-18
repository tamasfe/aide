// type SignupFlowState = {
//   lastSyncedAt: null;
//   signupFlow: null;
// } | {
//   lastSyncedAt: Date;
//   signupFlow: {
//     id: string;
//     email: null | string;
//     password: null | string;
//     cpf: null | string;
//     telephone: null | string;
//     locale: null | string;
//     timeZone: null | string;
//     utmParameters: null | Record<string, string>;
//   };
// };

// export default defineStore("signupFlowStore", {
//   state: (): SignupFlowState => ({
//     lastSyncedAt: null,
//     signupFlow: null,
//   }),

//   actions: {
//     async delete() {
//       const { $dependencies } = useNuxtApp();

//       const result = await $dependencies.signupFlows.application.deleteCurrentSignupFlowId.handle();
//       if (result.isFailure) {
//         logger.error("Error deleting current signup flow ID inside signup flow store", result.error);
//         return;
//       }
//     },

//     async syncWithBackend() {
//       const { $dependencies } = useNuxtApp();

//       const result = await $dependencies.signupFlows.application.searchCurrentSignupFlow.handle();
//       if (result.isFailure) {
//         logger.error("Error searching current signup flow inside signup flow store", result.error);
//         return;
//       }

//       this.lastSyncedAt = new Date();
//       this.signupFlow = result.value;
//     },

//     async create() {
//       const { $dependencies } = useNuxtApp();

//       const result = await $dependencies.signupFlows.application.createSignupFlow.handle();
//       if (result.isFailure) {
//         logger.error("Error creating signup flow inside signup flow store", result.error);
//         return;
//       }
//     },

//     updateField() {
//       // TODO: implement
//     },
//   },
// });
