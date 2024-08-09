// from admin proxy
// https://h3.unjs.io/guide/event
export default defineEventHandler(async (event) => {
  const { endpoint } = getRouterParams(event);

  return proxyRequest(event, `http://localhost:3050/${endpoint}`, {
    streamRequest: true,
  });
});
