import { once } from 'node:events'
import { parse } from 'node:url'
import Hero from '../entities/hero.js'
import { DEFAULT_HEADER } from '../util/util.js'

const routes = ({ heroService }) => ({

  '/heroes:get': async (request, response) => {
    const { query } = parse(request.url, true)

    if (query.id) {
      const id = query.id
      const hero = await heroService.findByID(id)

      response.writeHead(hero !== undefined ? 200 : 404)
      response.write(hero !== undefined ?
        JSON.stringify(hero) :
        JSON.stringify({ status: 404, message: `Hero ${id} not found` }))
    } else {
      const heroes = await heroService.find()
      response.write(JSON.stringify({ results: heroes }))  
    }

    return response.end()
  },

  '/heroes:post': async (request, response) => {
    const data = await once(request, 'data')
    const hero = new Hero(JSON.parse(data))

    const id = await heroService.create(hero)

    response.writeHead(201, DEFAULT_HEADER)
    response.write(JSON.stringify({ id, ...hero }))

    return response.end()
  },

  '/heroes:put': async (request, response) => {
    const data = await once(request, 'data')
    const hero = new Hero(JSON.parse(data))

    const { query } = parse(request.url, true)
    const id = query.id

    const updatedHero = await heroService.update(id, hero)

    response.writeHead(200, DEFAULT_HEADER)
    response.write(JSON.stringify(updatedHero))

    return response.end()
  },

  '/heroes:delete': async (request, response) => {
    const { query } = parse(request.url, true)
    const id = query.id

    await heroService.delete(id)

    response.writeHead(204, DEFAULT_HEADER)

    return response.end()
  }
})

export {
  routes
}