import { assertEquals } from "https://deno.land/std@0.113.0/testing/asserts.ts";
import { getHello, setHello } from "../../services/helloService.js";
import { superoak } from "https://deno.land/x/superoak@4.4.0/mod.ts";
import { app } from "../../app.js";

Deno.test("Calling 'getHello()' returns 'Oh, hello there!'", async () => {
  assertEquals("Oh, hello there!", getHello());
});

Deno.test("Calling 'setHello()' returns undefined", async () => {
  assertEquals(undefined, setHello());
});

Deno.test("Calling 'setHello('Hello')' returns 'Hello'", async () => {
  setHello("Hello");
  assertEquals("Hello", getHello());
});

Deno.test("Calling 'setHello('Oh, hello there!')' returns undefined", async () => {
  assertEquals(undefined, setHello("Oh, hello there!"));
});

Deno.test("POST to /api/hello should return response status 200", async () => {
  const testClient = await superoak(app);
  await testClient.post("/api/hello")
    .set("Content-type", "application/json")
    .send('{ "message": "Moikkumoi" }')
    .expect(200);
});

Deno.test("GET to /api/hello should return '{message:'Moikkumoi'}'", async () => {
  const testClient = await superoak(app);
  await testClient.get("/api/hello")
    .expect('{"message":"Moikkumoi"}');
});