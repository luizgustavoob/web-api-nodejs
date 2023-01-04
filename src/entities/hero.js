import { randomUUID } from 'node:crypto'

export default class Hero {

  constructor({ id, name, age, power }) {
    this.id = id !== undefined ? id : randomUUID()
    this.name = name
    this.age = age
    this.power = power
  }
}