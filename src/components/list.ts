import Child from '../modules/child'
import { every } from 'lodash'

class List extends Child {
  types: CheerioElement[] = []
  regex: RegExp = /^[A-Z][a-zA-Z0-9]+$/

  initialize(): void {
    this.types = this.findTypes()
  }

  findTypes(): CheerioElement[] {
    return this.main
      .cheerio('#dev_page_content')
      .children('ul')
      .toArray()
      .filter((v: CheerioElement) =>
        every(this.main.cheerio('li', v).toArray(), (v: CheerioElement) => this.main.cheerio(v).has('a') && this.main.cheerio('a', v).text().match(this.regex))
      )
  }
}

export default List
