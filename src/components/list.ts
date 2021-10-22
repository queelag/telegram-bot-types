import { every } from 'lodash'
import Child from '../modules/child'

class List extends Child {
  types: cheerio.Element[] = []
  regex: RegExp = /^[A-Z][a-zA-Z0-9]+$/

  initialize(): void {
    this.types = this.findTypes()
  }

  findTypes(): cheerio.Element[] {
    return this.main
      .cheerio('#dev_page_content')
      .children('ul')
      .toArray()
      .filter((v: cheerio.Element) =>
        every(
          this.main.cheerio('li', v).toArray(),
          (v: cheerio.Element) =>
            this.main.cheerio(v).has('a') &&
            this.main.cheerio('a', v).text().match(this.regex) &&
            !this.main.cheerio(v).html().includes('<em>') &&
            !this.main.cheerio(v).html().includes('Added the ability to specify a custom input field placeholder in the classes')
        )
      )
  }
}

export default List
