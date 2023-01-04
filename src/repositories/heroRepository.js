import { readFile, writeFile } from 'node:fs/promises'

export default class HeroRepository {

  constructor({ file }) {
    this.file = file
  }

  async #currentFileContent() {
    return JSON.parse(await readFile(this.file))
  }

  find() {
    return this.#currentFileContent()
  }

  async findByID(id) {
    const currentFile = await this.#currentFileContent()
    return currentFile.find(item => item.id === id) 
  }

  async create(data) {
    const currentFile = await this.#currentFileContent()
    currentFile.push(data)

    await writeFile(this.file, JSON.stringify(currentFile))

    return data.id
  }

  async update(id, data) {
    const currentFile = await this.#currentFileContent()

    const index = currentFile.findIndex(item => item.id === id)
    if (index < 0) {
      throw new Error(`Hero ID ${id} not found`)
    }

    const updated = { ...currentFile[index], ...data }
    currentFile[index] = updated

    await writeFile(this.file, JSON.stringify(currentFile))

    return updated
  }

  async delete(id) {
    const currentFile = await this.#currentFileContent()
    const data = currentFile.filter(item => item.id !== id)

    await writeFile(this.file, JSON.stringify(data))
  }
}