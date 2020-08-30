import Child from '../modules/child'
import { Type, Method, Field, Parameter } from '../definitions/types'
import { last, startCase } from 'lodash'

class Parser extends Child {
  methods: Method[] = []
  types: Type[] = []

  initialize(): void {
    this.methods = this.reduceTablesToMethods(this.main.table.methods)
    this.types = this.reduceTablesToTypes(this.main.table.types).concat(this.reduceListsToTypes(this.main.list.types))
  }

  reduceTableBodyToParameter(body: CheerioElement): Parameter {
    let parameter: Parameter

    parameter = {} as Parameter
    parameter.name = this.main.cheerio('td:nth-child(1)', body).text()
    parameter.type = this.main.cheerio('td:nth-child(2)', body).text()
    parameter.required = this.main.cheerio('td:nth-child(3)', body).text() === 'Yes'
    parameter.description = this.main.cheerio('td:nth-child(4)', body).text()

    return parameter
  }

  reduceTableBodyToField(body: CheerioElement): Field {
    let field: Field

    field = {} as Field
    field.name = this.main.cheerio('td:nth-child(1)', body).text()
    field.type = this.main.cheerio('td:nth-child(2)', body).text()
    field.description = this.main.cheerio('td:nth-child(3)', body).text()

    return field
  }

  reduceTableRowsToParameters(rows: CheerioElement[]): Parameter[] {
    return rows.reduce((r: Parameter[], v: CheerioElement) => [...r, this.reduceTableBodyToParameter(v)], [])
  }

  reduceTableRowsToFields(rows: CheerioElement[]): Field[] {
    return rows.reduce((r: Field[], v: CheerioElement) => [...r, this.reduceTableBodyToField(v)], [])
  }

  reduceTableToMethod(table: CheerioElement): Method {
    let rows: CheerioElement[], method: Method

    rows = this.main.cheerio('tbody > tr', table).toArray()

    method = {} as Method
    method.name = startCase(this.findTableName(table)).replace(/ /g, '')
    method.description = this.findTableDescription(table)
    method.parameters = this.reduceTableRowsToParameters(rows)

    return method
  }

  reduceTableToType(table: CheerioElement): Type {
    let rows: CheerioElement[], type: Type

    rows = this.main.cheerio('tbody > tr', table).toArray()

    type = {} as Type
    type.name = this.findTableName(table)
    type.description = this.findTableDescription(table)
    type.fields = this.reduceTableRowsToFields(rows)
    type.matches = []

    return type
  }

  reduceTablesToMethods(tables: CheerioElement[]): Method[] {
    return tables.reduce((r: Method[], v: CheerioElement) => [...r, this.reduceTableToMethod(v)], [])
  }

  reduceTablesToTypes(tables: CheerioElement[]): Type[] {
    return tables.reduce((r: Type[], v: CheerioElement) => [...r, this.reduceTableToType(v)], [])
  }

  reduceListLinkToMatch(link: CheerioElement): string {
    return this.main.cheerio(link).text()
  }

  reduceListLinksToMatches(links: CheerioElement[]): string[] {
    return links.reduce((r: string[], v: CheerioElement) => [...r, this.reduceListLinkToMatch(v)], [])
  }

  reduceListToType(list: CheerioElement): Type {
    let links: CheerioElement[], type: Type

    links = this.main.cheerio('li > a', list).toArray()

    type = {} as Type
    type.name = this.findListName(list)
    type.description = this.findListDescription(list)
    type.fields = []
    type.matches = this.reduceListLinksToMatches(links)

    return type
  }

  reduceListsToTypes(lists: CheerioElement[]): Type[] {
    return lists.reduce((r: Type[], v: CheerioElement) => [...r, this.reduceListToType(v)], [])
  }

  reduceParagraphsToString(paragraphs: CheerioElement[]): string {
    return paragraphs
      .reduce((r: string[], v: CheerioElement) => {
        let text: string

        text = this.main.cheerio(v).text()
        if (text.trim().length <= 0) return r

        return [...r, text]
      }, [])
      .join('\n')
  }

  findTableName(table: CheerioElement): string {
    let paragraphs: CheerioElement[], heading: Cheerio

    paragraphs = this.main.cheerio(table).prevUntil('h4', 'p').toArray()
    heading = this.main.cheerio(last(paragraphs)).prev('h4')

    return heading.text()
  }

  findListName(list: CheerioElement): string {
    return this.findTableName(list)
  }

  findTableDescription(table: CheerioElement): string {
    return this.reduceParagraphsToString(this.main.cheerio(table).prevUntil('h4', 'p').toArray())
  }

  findListDescription(list: CheerioElement): string {
    return this.findTableDescription(list)
  }
}

export default Parser
