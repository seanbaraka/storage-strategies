import { PullResponse } from "replicache";

export default defineEventHandler(async(event) => {
  const body = await readBody(event);
  console.log(body)
  const storage = useStorage();
  const count = await storage.getItem<number>('counter') ?? 0;
  console.log('Someone wants an updated value', {count});
  /**
   * The structure of the response
   * `
   * {
   *    op: 'put',
   *    key: 'count',
   *    value: {
   *      content: 0,
   *    }
   * }`
   */
  const response = {
    op: 'put',
    key: `count/${200}`,
    value: count
  }
  console.log(response)
  return { lastMutationIDChanges: {}, cookie: 42, patch: [response] }
})
