import { Child } from '../modules/child'

export class Paragraph extends Child {
  types: cheerio.Element[] = []
  regex: RegExp = /^[A-Z][a-zA-Z0-9]+$/

  initialize(): void {
    this.types = this.findTypes()
    console.log(this.types.map((v) => this.main.cheerio(v).text()))
  }

  findTypes(): cheerio.Element[] {
    return this.main
      .cheerio('#dev_page_content')
      .children('p')
      .toArray()
      .filter(
        (p: cheerio.Element) =>
          this.main.cheerio(p).html().includes('Currently holds no information.') && this.main.cheerio(p).prev('h4').text().match(this.regex)
      )
  }
}
