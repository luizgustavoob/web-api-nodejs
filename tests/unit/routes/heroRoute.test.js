import { test } from 'node:test'
import assert from 'node:assert'
import { routes } from './../../../src/routes/heroRoute.js'

const callTracker = new assert.CallTracker()
process.on('exit', () => callTracker.verify())

test('Hero routes - endpoints test suite', async (t) => {

  await t.test('it should call /heroes:get route', async () => {
    const databaseMock = [{
      "id": "90bf10a3-c9fb-406a-a35a-3e4a8db0fbf8",
      "name": "Batman",
      "age": 50,
      "power": "rich"
    }]

    const heroServiceStub = {
      find: async () => databaseMock
    }

    const endpoints = routes({ heroService: heroServiceStub })

    const request = {
      url: '/heroes'
    }

    const response = {
      write: callTracker.calls(item => {
        const expected = JSON.stringify({ results: databaseMock })
        assert.strictEqual(item, expected, 'write should be called with the correct payload')
      }),

      end: callTracker.calls(item => {
        assert.strictEqual(item, undefined, 'end should be called without params')
      })
    }

    const endpoint = '/heroes:get'
    const route = endpoints[endpoint]
    await route(request, response)
  })

  await t.test('it should call /herores:get route with queryParams', async () => {
    const databaseMock = [{
      "id": "90bf10a3-c9fb-406a-a35a-3e4a8db0fbf8",
      "name": "Batman",
      "age": 50,
      "power": "rich"
    }]

    const heroServiceStub = { findByID: async (id) => { return databaseMock[0] } }

    const endpoints = routes({ heroService: heroServiceStub })

    const request = {
      url: '/heroes?id=90bf10a3-c9fb-406a-a35a-3e4a8db0fbf8'
    }

    const response = {
      writeHead: callTracker.calls(item => {
        assert.strictEqual(item, 200, 'writeHead should be called with the correct statusCode (200)')
      }),

      write: callTracker.calls(item => {
        assert.strictEqual(item, JSON.stringify(databaseMock[0]), 'write should be called with the correct payload')
      }),

      end: callTracker.calls(item => {
        assert.strictEqual(item, undefined, 'end should be called without params')
      })
    }

    const endpoint = '/heroes:get'
    const route = endpoints[endpoint]
    await route(request, response)
  })

  await t.test('it should call /heroes:get route with queryParams and return 404 error', async () => {
    const heroServiceStub = { findByID: async (id) => { return undefined } }

    const endpoints = routes({ heroService: heroServiceStub })

    const request = {
      url: '/heroes?id=invalid-id'
    }

    const response = {
      writeHead: callTracker.calls(item => {
        assert.strictEqual(item, 404, 'writeHead should be called with the correct statusCode (404)')
      }),

      write: callTracker.calls(item => {
        assert.strictEqual(item, JSON.stringify({ status: 404, message: `Hero invalid-id not found` }),
          'write should be called with the correct payload')
      }),

      end: callTracker.calls(item => {
        assert.strictEqual(item, undefined, 'end should be called without params')
      })
    }

    const endpoint = '/heroes:get'
    const route = endpoints[endpoint]
    await route(request, response)
  })

  await t.test('it should call /heroes:delete route', async () => {
    const heroServiceStub = { delete: async (id) => { } }

    const endpoints = routes({ heroService: heroServiceStub })

    const request = {
      url: '/delete?id=1234'
    }

    const response = {
      writeHead: callTracker.calls(item => {
        assert.strictEqual(item, 204, 'writeHead should be called with the correct statusCode (204)')
      }),

      end: callTracker.calls(item => {
        assert.strictEqual(item, undefined, 'end should be called without params')
      })
    }

    const endpoint = '/heroes:delete'
    const route = endpoints[endpoint]
    await route(request, response)
  })

  await t.todo('it should call /heroes:post route', async () => {
    const data = { name: "Aquaman", age: 25, power: "water" }

    const heroServiceStub = {
      create: async () => { return { id: "123", ...data } }
    }

    const endpoints = routes({ heroService: heroServiceStub })

    /*  TODO: How do the mock? 
    const request = {}
    */

    const response = {
      writeHead: callTracker.calls(item => {
        assert.strictEqual(item, 201, 'writeHead should be called with the correct statusCode (201)')
      }),

      write: callTracker.calls(item => {
        assert.strictEqual(item.id, "123")
        assert.strictEqual(item.name, data.name)
        assert.strictEqual(item.age, data.age)
        assert.strictEqual(item.power, data.power)
      }),

      end: callTracker.calls(item => {
        assert.strictEqual(item, undefined, 'end should be called without params')
      })
    }

    const endpoint = '/heroes:post'
    const route = endpoints[endpoint]
    await route(request, response)
  })

  await t.todo('it should call /heroes:put route', async () => { })

})