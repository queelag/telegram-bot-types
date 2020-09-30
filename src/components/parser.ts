import { last, startCase } from 'lodash'
import { Field, Method, Parameter, Type } from '../definitions/types'
import Child from '../modules/child'

class Parser extends Child {
  methods: Method[] = []
  types: Type[] = []

  initialize(): void {
    this.methods = this.reduceTablesToMethods(this.main.table.methods)
    this.types = this.reduceTablesToTypes(this.main.table.types).concat(this.reduceListsToTypes(this.main.list.types))
  }

  reduceTableBodyToParameter(body: cheerio.Element): Parameter {
    let parameter: Parameter

    parameter = {} as Parameter
    parameter.name = this.main.cheerio('td:nth-child(1)', body).text()
    parameter.type = this.main.cheerio('td:nth-child(2)', body).text()
    parameter.required = this.main.cheerio('td:nth-child(3)', body).text() === 'Yes'
    parameter.description = this.main.cheerio('td:nth-child(4)', body).text()

    return parameter
  }

  reduceTableBodyToField(body: cheerio.Element): Field {
    let field: Field

    field = {} as Field
    field.name = this.main.cheerio('td:nth-child(1)', body).text()
    field.type = this.main.cheerio('td:nth-child(2)', body).text()
    field.description = this.main.cheerio('td:nth-child(3)', body).text()

    return field
  }

  reduceTableRowsToParameters(rows: cheerio.Element[]): Parameter[] {
    return rows.reduce((r: Parameter[], v: cheerio.Element) => [...r, this.reduceTableBodyToParameter(v)], [])
  }

  reduceTableRowsToFields(rows: cheerio.Element[]): Field[] {
    return rows.reduce((r: Field[], v: cheerio.Element) => [...r, this.reduceTableBodyToField(v)], [])
  }

  reduceTableToMethod(table: cheerio.Element): Method {
    let rows: cheerio.Element[], method: Method

    rows = this.main.cheerio('tbody > tr', table).toArray()

    method = {} as Method
    method.name = startCase(this.findTableName(table)).replace(/ /g, '')
    method.description = this.findTableDescription(table)
    method.parameters = this.reduceTableRowsToParameters(rows)

    return method
  }

  reduceTableToType(table: cheerio.Element): Type {
    let rows: cheerio.Element[], type: Type

    rows = this.main.cheerio('tbody > tr', table).toArray()

    type = {} as Type
    type.name = this.findTableName(table)
    type.description = this.findTableDescription(table)
    type.fields = this.reduceTableRowsToFields(rows)
    type.matches = []

    return type
  }

  reduceTablesToMethods(tables: cheerio.Element[]): Method[] {
    return tables.reduce((r: Method[], v: cheerio.Element) => [...r, this.reduceTableToMethod(v)], [])
  }

  reduceTablesToTypes(tables: cheerio.Element[]): Type[] {
    return tables.reduce((r: Type[], v: cheerio.Element) => [...r, this.reduceTableToType(v)], [])
  }

  reduceListLinkToMatch(link: cheerio.Element): string {
    return this.main.cheerio(link).text()
  }

  reduceListLinksToMatches(links: cheerio.Element[]): string[] {
    return links.reduce((r: string[], v: cheerio.Element) => [...r, this.reduceListLinkToMatch(v)], [])
  }

  reduceListToType(list: cheerio.Element): Type {
    let links: cheerio.Element[], type: Type

    links = this.main.cheerio('li > a', list).toArray()

    type = {} as Type
    type.name = this.findListName(list)
    type.description = this.findListDescription(list)
    type.fields = []
    type.matches = this.reduceListLinksToMatches(links)

    return type
  }

  reduceListsToTypes(lists: cheerio.Element[]): Type[] {
    return lists.reduce((r: Type[], v: cheerio.Element) => [...r, this.reduceListToType(v)], [])
  }

  reduceParagraphsToString(paragraphs: cheerio.Element[]): string {
    return paragraphs
      .reduce((r: string[], v: cheerio.Element) => {
        let text: string

        text = this.main.cheerio(v).text()
        if (text.trim().length <= 0) return r

        return [...r, text]
      }, [])
      .join('\n')
  }

  findTableName(table: cheerio.Element): string {
    let paragraphs: cheerio.Element[], heading: cheerio.Cheerio

    paragraphs = this.main.cheerio(table).prevUntil('h4', 'p').toArray()
    heading = this.main.cheerio(last(paragraphs)).prev('h4')

    return heading.text()
  }

  findListName(list: cheerio.Element): string {
    return this.findTableName(list)
  }

  findTableDescription(table: cheerio.Element): string {
    return this.reduceParagraphsToString(this.main.cheerio(table).prevUntil('h4', 'p').toArray())
  }

  findListDescription(list: cheerio.Element): string {
    return this.findTableDescription(list)
  }
}

export default Parser
