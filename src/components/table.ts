import { Cheerio } from 'cheerio'
import { Element } from 'domhandler'
import { Child } from '../modules/child'

export class Table extends Child {
  all: Element[] = []
  methods: Element[] = []
  types: Element[] = []

  initialize(): void {
    this.all = this.findAll()
    this.methods = this.findMethods()
    this.types = this.findTypes()
  }

  findAll(): Element[] {
    return this.main.cheerio('#dev_page_content').children('table').toArray()
  }

  findMethods(): Element[] {
    return this.filterByTableHeadFirstValue('Parameter', this.all)
  }

  findTypes(): Element[] {
    return this.filterByTableHeadFirstValue('Field', this.all)
  }

  filterByTableHeadFirstValue(value: string, tables: Element[]): Element[] {
    let filtered: Element[] = []

    for (let table of tables) {
      let head: Cheerio<Element>, text: string

      head = this.main.cheerio('thead > tr > th:first-child', table)
      text = head.text()

      if (text === value) {
        filtered.push(table)
      }
    }

    return filtered
  }
}
