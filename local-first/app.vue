<script setup lang="ts">
import { Replicache } from "replicache";

const {
  public: { replicacheKey },
} = useRuntimeConfig();

const rep = new Replicache({
  name: "ultimate-counters",
  licenseKey: replicacheKey as string,
  pullURL: "/api/get-count",
  pushURL: "/api/update-count",
  mutators: {
    increment: async (tx, delta: number) => {
      const id = 200
      const count = (await tx.get(`count/${id}`)) ?? 0;
      console.log('Current Count Value', count)
      const next = count + delta;
      await tx.set(`count/${id}`, next);
      return next;
    },
  },
});

// subscribe to changes
rep.subscribe(
  async (tx) => (await tx.scan({ prefix: "count/" }).entries().toArray()) ?? [],
  (data: any[]) => {
    console.log('New Data', data)
    count.value = data[data.length - 1][1];
  }
);

const count = ref(0);

const increment = async () => {
  count.value = await rep.mutate.increment(Math.floor(Math.random() * 10));
};

// Attempt to start a SSE connection
const sseConnection = new EventSource("/api/sse");
sseConnection.onmessage = async (event) => {
  console.log("SSE Data", event.data);
  console.log("getting the recent count");
  await rep.pull();
};
sseConnection.onerror = (error) => {
  console.log("An Error Occurred", error);
};
</script>
<template>
  <div>
    <button @click="increment">WTF {{ count }}</button>
  </div>
</template>
