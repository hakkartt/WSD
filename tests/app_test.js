import { superoak } from "https://deno.land/x/superoak@4.4.0/mod.ts";

import { app } from "../app.js";

Deno.test("POST to / with JSON '{ name: 'Mauno', age: 6 }' should return '{name:'Mauno',age:6}'", async () => {
    const testClient = await superoak(app);
    const response = await testClient.post("/")
      .set("Content-type", "application/json")
      .send('{ "name": "Mauno", "age": 6 }')
      .expect('{"name":"Mauno","age":6}');
  });

Deno.test("POST to /name with JSON '{ name: 'Mauno', age: 6 }' should return '{name:'Mauno'}'", async () => {
    const testClient = await superoak(app);
    const response = await testClient.post("/name")
      .set("Content-type", "application/json")
      .send('{ "name": "Mauno", "age": 6 }')
      .expect('{"name":"Mauno"}');
  });

Deno.test("POST to /name with JSON '{ name: 'Pentti', gender: 'male' }' should return '{name:'Pentti'}'", async () => {
    const testClient = await superoak(app);
    const response = await testClient.post("/name")
      .set("Content-type", "application/json")
      .send('{ "name": "Pentti", "gender": "male" }')
      .expect('{"name":"Pentti"}');
  });

Deno.test("POST to / with JSON '{ name: 'Mauno', age: 6 }' should return '{name:'Mauno',age:6}'", async () => {
    const testClient = await superoak(app);
    const response = await testClient.post("/")
      .set("Content-type", "application/json")
      .send('{ "name": "Mauno", "age": 6 }')
      .expect('{"name":"Mauo","age":6}');
  });

Deno.test("POST to /name with JSON '{ name: 'Mauno', age: 6 }' should return '{name:'Mauno'}'", async () => {
    const testClient = await superoak(app);
    const response = await testClient.post("/name")
      .set("Content-type", "application/json")
      .send('{ "name": "Mauno", "age": 6 }')
      .expect('{"name":"Mauno","age":6}');
  });