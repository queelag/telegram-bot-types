import { Child } from '../modules/child'

export class List extends Child {
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
      .filter((ul: cheerio.Element) =>
        this.main
          .cheerio('li', ul)
          .toArray()
          .every(
            (li: cheerio.Element) =>
              this.main.cheerio(li).has('a') &&
              this.main.cheerio('a', li).text().match(this.regex) &&
              !this.main.cheerio(li).html()?.includes('<em>') &&
              !this.main
                .cheerio(li)
                .html()
                ?.includes(`Added support for photos and videos in the 'What can this bot do?' section (shown on the bot's start screen).`)
          )
      )
  }
}
