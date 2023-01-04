export default class HeroService {

  constructor({ heroRepository }) {
    this.heroRepository = heroRepository
  }

  find() {
    return this.heroRepository.find()
  }

  findByID(id) {
    return this.heroRepository.findByID(id)
  }

  create(data) {
    return this.heroRepository.create(data)
  }

  update(id, data) {
    return this.heroRepository.update(id, data)
  }

  delete(id) {
    this.heroRepository.delete(id)
  }
}