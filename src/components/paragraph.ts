import { Element } from 'domhandler'
import { Child } from '../modules/child'

export class Paragraph extends Child {
  types: Element[] = []
  regex: RegExp = /^[A-Z][a-zA-Z0-9]+$/

  initialize(): void {
    this.types = this.findTypes()
  }

  findTypes(): Element[] {
    return this.main
      .cheerio('#dev_page_content')
      .children('p')
      .toArray()
      .filter(
        (p: Element) => this.main.cheerio(p).html()?.includes('Currently holds no information.') && this.regex.exec(this.main.cheerio(p).prev('h4').text())
      )
  }
}
