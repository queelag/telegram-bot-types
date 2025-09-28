import { Fetch, FetchError, FetchResponse } from '@aracna/core'
import { CheerioAPI, load } from 'cheerio'
import { List } from './components/list.js'
import { Paragraph } from './components/paragraph.js'
import { Parser } from './components/parser.js'
import { Table } from './components/table.js'
import { Writer } from './components/writer.js'

export class Main {
  cheerio: CheerioAPI = load('')
  html: string = ''

  list: List = new List(this)
  paragraph: Paragraph = new Paragraph(this)
  parser: Parser = new Parser(this)
  table: Table = new Table(this)
  writer: Writer = new Writer(this)

  async initialize(): Promise<void> {
    let response: FetchResponse<string> | FetchError

    response = await Fetch.get('https://core.telegram.org/bots/api')
    if (response instanceof Error) return

    this.html = response.data
    this.cheerio = load(this.html)
  }
}
