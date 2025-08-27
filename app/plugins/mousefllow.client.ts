export default defineNuxtPlugin({
  name: "mouseflow",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const router = useRouter();

    router.afterEach((to) => {
      if (typeof window._mfq !== "undefined") {
        window._mfq.push(["newPageView", to.fullPath]);
      }
    });
  },
});
