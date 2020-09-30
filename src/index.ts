import axios, { AxiosResponse } from 'axios'
import cheerio from 'cheerio'
import List from './components/list'
import Parser from './components/parser'
import Table from './components/table'
import Writer from './components/writer'

class Main {
  cheerio: cheerio.Root = cheerio.load('')
  html: string = ''

  list: List = new List(this)
  parser: Parser = new Parser(this)
  table: Table = new Table(this)
  writer: Writer = new Writer(this)

  async initialize(): Promise<void> {
    let response: AxiosResponse<string>

    response = await axios.get<string>('https://core.telegram.org/bots/api')

    this.html = response.data
    this.cheerio = cheerio.load(this.html)
  }
}

export default Main
