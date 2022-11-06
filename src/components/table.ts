import { Child } from '../modules/child'

export class Table extends Child {
  all: cheerio.Element[] = []
  methods: cheerio.Element[] = []
  types: cheerio.Element[] = []

  initialize(): void {
    this.all = this.findAll()
    this.methods = this.findMethods()
    this.types = this.findTypes()
  }

  findAll(): cheerio.Element[] {
    return this.main.cheerio('#dev_page_content').children('table').toArray()
  }

  findMethods(): cheerio.Element[] {
    return this.filterByTableHeadFirstValue('Parameter', this.all)
  }

  findTypes(): cheerio.Element[] {
    return this.filterByTableHeadFirstValue('Field', this.all)
  }

  filterByTableHeadFirstValue(value: string, tables: cheerio.Element[]): cheerio.Element[] {
    let filtered: cheerio.Element[] = []

    for (let table of tables) {
      let head: cheerio.Cheerio, text: string

      head = this.main.cheerio('thead > tr > th:first-child', table)
      text = head.text()

      if (text === value) {
        filtered.push(table)
      }
    }

    return filtered
  }
}
