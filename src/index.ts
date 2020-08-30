import Table from './components/table'
import Parser from './components/parser'
import cheerio from 'cheerio'
import axios, { AxiosResponse } from 'axios'
import Writer from './components/writer'
import List from './components/list'

class Main {
  cheerio: CheerioStatic = cheerio.load('')
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
