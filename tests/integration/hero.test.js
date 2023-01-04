import { test } from "node:test"
import assert from "node:assert"
import { promisify } from "node:util"

test("Hero Integration Test Suite", async (t) => {
  const testPort = 9009;

  // that's bad practice because it mutates the environment
  process.env.PORT = testPort;
  process.env.ENVIRONMENT = "test";

  const { server } = await import("../../src/index.js");
  const testServerAddress = `http://localhost:${testPort}/heroes`;

  await t.test("it should create a hero", async (t) => {
    const data = {
      name: "Batman",
      age: 50,
      power: "rich",
    };

    const request = await fetch(testServerAddress, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await request.json();

    assert.deepStrictEqual(
      request.headers.get("content-type"),
      "application/json"
    );
    assert.strictEqual(request.status, 201);
    assert.ok(result.id.length > 30, "id should be a valid uuid");
    assert.strictEqual(result.name, "Batman");
    assert.strictEqual(result.age, 50);
    assert.strictEqual(result.power, "rich");
  });

  await t.test("it should return a list of heroes", async (t) => {
    await fetch(testServerAddress, {
      method: "POST",
      body: JSON.stringify({
        name: "Superman",
        age: 25,
        power: "strength",
      }),
    });

    const request = await fetch(testServerAddress);
    const result = await request.json();

    assert.strictEqual(request.status, 200);
    assert.ok(result.results.length > 0, `it should return a filled list`);
  });

  await t.test("it should return a hero", async () => {
    const postReq = await fetch(testServerAddress, {
      method: "POST",
      body: JSON.stringify({
        name: "Lanterna Verde",
        age: 40,
        power: "anel",
      }),
    });

    const postResult = await postReq.json();
    const endpoint = `${testServerAddress}?id=${postResult.id}`;

    const request = await fetch(endpoint);
    const result = await request.json();

    assert.strictEqual(request.status, 200);
    assert.strictEqual(result.name, 'Lanterna Verde');
    assert.strictEqual(result.age, 40);
    assert.strictEqual(result.power, 'anel');
  })

  await t.test("it should update a hero", async (t) => {
    const postReq = await fetch(testServerAddress, {
      method: "POST",
      body: JSON.stringify({
        name: "Flash",
        age: 28,
        power: "speed",
      }),
    });

    const postResult = await postReq.json();
    const endpoint = `${testServerAddress}?id=${postResult.id}`;

    const request = await fetch(endpoint, {
      method: "PUT",
      body: JSON.stringify({
        name: "Flash",
        age: 25,
        power: "speed",
      }),
    });

    const result = await request.json();

    assert.strictEqual(request.status, 200);
    assert.strictEqual(result.name, "Flash");
    assert.strictEqual(result.age, 25);
    assert.strictEqual(result.power, "speed");
  });

  await t.test("it should remove a hero", async () => {
    const postReq = await fetch(testServerAddress, {
      method: "POST",
      body: JSON.stringify({
        name: "Aquaman",
        age: 32,
        power: "water",
      }),
    });

    const postResult = await postReq.json();
    const endpoint = `${testServerAddress}?id=${postResult.id}`;
    const request = await fetch(endpoint, { method: "DELETE" });

    assert.strictEqual(request.status, 204);
  });

  await t.test("it should return an application error when the request is invalid", async () => {
    const request = await fetch(testServerAddress, {
      method: "POST",
      body: "invalid json",
    });

    assert.strictEqual(request.status, 500)

    const result = await request.json()

    assert.strictEqual(result.status, 500)
    assert.strictEqual(result.message, 'internal server error')
  })

  await t.test("it should return a not found error", async () => {
    const endpoint = `${testServerAddress}abcdef`;
    const request = await fetch(endpoint);

    assert.strictEqual(request.status, 404)
    
    const result = await request.json()

    assert.strictEqual(result.status, 404)
    assert.strictEqual(result.message, 'resource not found')
  })

  await promisify(server.close.bind(server))();
});
