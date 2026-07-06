import type { Element } from 'domhandler'
import { PARAGRAPH_REGEXP } from '../definitions/constants.js'
import { Child } from '../modules/child.js'

export class Paragraph extends Child {
  types: Element[] = []
  regex: RegExp = PARAGRAPH_REGEXP

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
