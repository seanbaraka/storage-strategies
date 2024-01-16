import { sseClients } from "~/server/middleware/sse";

export default defineEventHandler(async(event) => {
  const storage = useStorage();
  const body = await readBody(event);
  const mutations: any[] = body.mutations;
  const count = mutations[mutations.length -1].args;
  for(let i = 0; i < sseClients.length; i++) {
    const client = sseClients[i];
    console.log('all clients', sseClients.length)
    client.response.write(`request: ping`);
  }
  let counter = await storage.getItem<number>('counter');
  if(!counter) {
    await storage.setItem('counter', count);
  } else {
    counter += count;
    await storage.setItem('counter', counter)
  }
  return { count }
})
