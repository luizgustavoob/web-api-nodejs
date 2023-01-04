import { describe, it } from 'node:test'
import assert from 'node:assert'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import HeroRepository from "../../../src/repositories/heroRepository.js"
import Hero from '../../../src/entities/hero.js'

describe('Hero Repository tests', async () => {
    const currentDir = dirname(fileURLToPath(import.meta.url))
    const filePath = join(currentDir, '../../../database', 'data-test.json')
    const repo = new HeroRepository({ file: filePath })

    it('it should create a hero', async () => {
        const hero = new Hero({ name: 'Sonic', age: 10, power: "speed" })
        const id = await repo.create(hero)

        assert.ok(id.length > 0, 'it should be a valid ID')
    })

    it('it should return a list of heroes', async () => {
        const heroes = await repo.find()

        assert.ok(heroes.length > 0, 'it should be a filled list')
    })

    it('it should return a specific hero', async () => {
        const hero = new Hero({ name: "Pica pau", age: 17, power: "laugh" })
        const id = await repo.create(hero)

        const heroFounded = await repo.findByID(id)

        assert.strictEqual(heroFounded.id, id)
        assert.strictEqual(heroFounded.name, hero.name)
        assert.strictEqual(heroFounded.age, hero.age)
        assert.strictEqual(heroFounded.power, hero.power)
    })

    it('it should update a hero', async () => {
        const hero = new Hero({ name: 'Pantera Negar', age: 29, power: "noã sei" })
        const id = await repo.create(hero)

        const newHero = new Hero({ name: 'Pantera Negra', age: 30, power: "não sei" })
        const updated = await repo.update(id, newHero)

        assert.strictEqual(updated.name, newHero.name)
        assert.strictEqual(updated.age, newHero.age)
        assert.strictEqual(updated.power, newHero.power)
    })

    it('it should delete a hero', async () => {
        const hero = new Hero({ name: "Super Choque", age: 16, power: "eletrecidade" })
        const id = await repo.create(hero)

        await repo.delete(id)
        const superChoque = await repo.findByID(id)

        assert.strictEqual(superChoque, undefined)
    })
})