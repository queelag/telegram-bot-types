import Child from '../modules/child'

class Table extends Child {
  all: CheerioElement[] = []
  methods: CheerioElement[] = []
  types: CheerioElement[] = []

  initialize(): void {
    this.all = this.findAll()
    this.methods = this.findMethods()
    this.types = this.findTypes()
  }

  findAll(): CheerioElement[] {
    return this.main.cheerio('#dev_page_content').children('table').toArray()
  }

  findMethods(): CheerioElement[] {
    return this.filterByTableHeadFirstValue('Parameter', this.all)
  }

  findTypes(): CheerioElement[] {
    return this.filterByTableHeadFirstValue('Field', this.all)
  }

  filterByTableHeadFirstValue(value: string, tables: CheerioElement[]): CheerioElement[] {
    let filtered: CheerioElement[] = []

    tables.forEach((v: CheerioElement) => {
      let head: Cheerio, text: string

      head = this.main.cheerio('thead > tr > th:first-child', v)
      text = head.text()

      if (text === value) filtered.push(v)
    })

    return filtered
  }
}

export default Table
