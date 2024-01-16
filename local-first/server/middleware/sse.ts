export let sseClients: any[] = [];
export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname;
  const headers = getRequestHeaders(event);
  // Only Modify the route to api/sse endpoint
  if (path === '/api/sse') {
    // set the proper headers
    event.node.res.setHeader("Content-Type", "text/event-stream");
    event.node.res.setHeader("Connection", "keep-alive");
    event.node.res.setHeader("Cache-Control",'no-cache');
    // set the success status code
    event.node.res.statusCode = 200;
    event.node.res.write('data: \n\n')
    const clientId = Date.now()
    const client = {
      id: clientId,
      response: event.node.res
    }
    sseClients.push(client);
    event.node.req.on("close", () => {
      console.log('Terminated the SSE Connection');
      sseClients = sseClients.filter(c => c.id !== clientId);
    })
  }
})
