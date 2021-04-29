import { last, startCase } from 'lodash'
import { Field, Method, Parameter, Type } from '../definitions/types'
import Child from '../modules/child'

class Parser extends Child {
  methods: Method[] = []
  types: Type[] = []

  initialize(): void {
    this.methods = this.mapTablesToMethods(this.main.table.methods)
    this.types = this.mapTablesToTypes(this.main.table.types).concat(this.mapListsToTypes(this.main.list.types))
  }

  castTableBodyToParameter(body: cheerio.Element): Parameter {
    let parameter: Parameter

    parameter = {} as Parameter
    parameter.name = this.main.cheerio('td:nth-child(1)', body).text()
    parameter.type = this.main.cheerio('td:nth-child(2)', body).text()
    parameter.required = this.main.cheerio('td:nth-child(3)', body).text() === 'Yes'
    parameter.description = this.main.cheerio('td:nth-child(4)', body).text()

    return parameter
  }

  castTableBodyToField(body: cheerio.Element): Field {
    let field: Field

    field = {} as Field
    field.name = this.main.cheerio('td:nth-child(1)', body).text()
    field.type = this.main.cheerio('td:nth-child(2)', body).text()
    field.description = this.main.cheerio('td:nth-child(3)', body).text()

    return field
  }

  mapTableRowsToParameters(rows: cheerio.Element[]): Parameter[] {
    return rows.map((v: cheerio.Element) => this.castTableBodyToParameter(v))
  }

  mapTableRowsToFields(rows: cheerio.Element[]): Field[] {
    return rows.map((v: cheerio.Element) => this.castTableBodyToField(v))
  }

  castTableToMethod(table: cheerio.Element): Method {
    let rows: cheerio.Element[], method: Method

    rows = this.main.cheerio('tbody > tr', table).toArray()

    method = {} as Method
    method.name = startCase(this.findTableName(table)).replace(/ /g, '')
    method.description = this.findTableDescription(table)
    method.parameters = this.mapTableRowsToParameters(rows)

    return method
  }

  castTableToType(table: cheerio.Element): Type {
    let rows: cheerio.Element[], type: Type

    rows = this.main.cheerio('tbody > tr', table).toArray()

    type = {} as Type
    type.name = this.findTableName(table)
    type.description = this.findTableDescription(table)
    type.fields = this.mapTableRowsToFields(rows)
    type.matches = []

    return type
  }

  mapTablesToMethods(tables: cheerio.Element[]): Method[] {
    return tables.map((v: cheerio.Element) => this.castTableToMethod(v))
  }

  mapTablesToTypes(tables: cheerio.Element[]): Type[] {
    return tables.map((v: cheerio.Element) => this.castTableToType(v))
  }

  castListLinkToMatch(link: cheerio.Element): string {
    return this.main.cheerio(link).text()
  }

  mapListLinksToMatches(links: cheerio.Element[]): string[] {
    return links.map((v: cheerio.Element) => this.castListLinkToMatch(v))
  }

  castListToType(list: cheerio.Element): Type {
    let links: cheerio.Element[], type: Type

    links = this.main.cheerio('li > a', list).toArray()

    type = {} as Type
    type.name = this.findListName(list)
    type.description = this.findListDescription(list)
    type.fields = []
    type.matches = this.mapListLinksToMatches(links)

    return type
  }

  mapListsToTypes(lists: cheerio.Element[]): Type[] {
    return lists.map((v: cheerio.Element) => this.castListToType(v))
  }

  castParagraphsToString(paragraphs: cheerio.Element[]): string {
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
    return this.castParagraphsToString(this.main.cheerio(table).prevUntil('h4', 'p').toArray())
  }

  findListDescription(list: cheerio.Element): string {
    return this.findTableDescription(list)
  }
}

export default Parser
