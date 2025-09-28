import { Element } from 'domhandler'
import { Child } from '../modules/child.js'

export class List extends Child {
  types: Element[] = []
  regex: RegExp = /^[A-Z][a-zA-Z0-9]+$/

  initialize(): void {
    this.types = this.findTypes()
  }

  findTypes(): Element[] {
    return this.main
      .cheerio('#dev_page_content')
      .children('ul')
      .toArray()
      .filter((ul: Element) => {
        let li: Element[]

        li = this.main.cheerio('li', ul).toArray()
        if (li.length <= 0) return false

        return li.every(
          (li: Element) =>
            this.main.cheerio(li).has('a') &&
            this.regex.exec(this.main.cheerio('a', li).text()) &&
            !this.main.cheerio(li).html()?.includes('<em>') &&
            !this.main
              .cheerio(li)
              .text()
              ?.includes(`Added support for photos and videos in the 'What can this bot do?' section (shown on the bot's start screen).`) &&
            !this.main
              .cheerio(li)
              .text()
              ?.includes(`Added the field DeviceStorage, allowing Mini Apps to use a secure local storage on the user's device for sensitive data.`) &&
            !this.main
              .cheerio(li)
              .text()
              ?.includes(`Added the field SecureStorage, allowing Mini Apps to use a secure local storage on the user's device for sensitive data.`)
        )
      })
  }
}
