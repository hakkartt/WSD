import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { app } from "../../../app.js";

Deno.test({
  name: "Get mood when no data",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient
      .get("/api/mood")
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"))
      .expect({ today: null, yesterday: null });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
