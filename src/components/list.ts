import type { Element } from 'domhandler'
import { LIST_REGEXP } from '../definitions/constants.js'
import { Child } from '../modules/child.js'

export class List extends Child {
  types: Element[] = []
  regex: RegExp = LIST_REGEXP

  initialize(): void {
    this.types = this.findTypes()
  }

  findTypes(): Element[] {
    return this.main
      .cheerio('#dev_page_content')
      .children('ul')
      .toArray()
      .filter((ul: Element) => {
        let lis: Element[]

        lis = this.main.cheerio('li', ul).toArray()
        if (lis.length <= 0) return false

        return lis.every(
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
