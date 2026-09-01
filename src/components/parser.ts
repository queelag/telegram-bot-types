import { getPascalCaseString } from '@aracna/core'
import type { Cheerio } from 'cheerio'
import type { Element } from 'domhandler'
import type { Field, Method, Parameter, Type } from '../definitions/interfaces.js'
import { Child } from '../modules/child.js'

export class Parser extends Child {
  methods: Method[] = []
  types: Type[] = []

  initialize(): void {
    this.methods = this.mapTablesToMethods(this.main.table.methods)
    this.types = this.mapTablesToTypes(this.main.table.types)
      .concat(this.mapListsToTypes(this.main.list.types))
      .concat(this.mapParagraphsToTypes(this.main.paragraph.types))
  }

  castTableBodyToParameter(body: Element): Parameter {
    let parameter: Parameter

    parameter = {} as Parameter
    parameter.name = this.main.cheerio('td:nth-child(1)', body).text()
    parameter.type = this.main.cheerio('td:nth-child(2)', body).text()
    parameter.required = this.main.cheerio('td:nth-child(3)', body).text() === 'Yes'
    parameter.description = this.main.cheerio('td:nth-child(4)', body).text()

    return parameter
  }

  castTableBodyToField(body: Element): Field {
    let field: Field

    field = {} as Field
    field.name = this.main.cheerio('td:nth-child(1)', body).text()
    field.type = this.main.cheerio('td:nth-child(2)', body).text()
    field.description = this.main.cheerio('td:nth-child(3)', body).text()

    return field
  }

  mapTableRowsToParameters(rows: Element[]): Parameter[] {
    return rows.map((v: Element) => this.castTableBodyToParameter(v))
  }

  mapTableRowsToFields(rows: Element[]): Field[] {
    return rows.map((v: Element) => this.castTableBodyToField(v))
  }

  castTableToMethod(table: Element): Method {
    let rows: Element[], method: Method

    rows = this.main.cheerio('tbody > tr', table).toArray()

    method = {} as Method
    method.name = getPascalCaseString(this.findTableName(table)).replace(/ /g, '')
    method.description = this.findTableDescription(table)
    method.parameters = this.mapTableRowsToParameters(rows)

    return method
  }

  castTableToType(table: Element): Type {
    let rows: Element[], type: Type

    rows = this.main.cheerio('tbody > tr', table).toArray()

    type = {} as Type
    type.name = this.findTableName(table)
    type.description = this.findTableDescription(table)
    type.fields = this.mapTableRowsToFields(rows)
    type.matches = []

    return type
  }

  mapTablesToMethods(tables: Element[]): Method[] {
    return tables.map((v: Element) => this.castTableToMethod(v))
  }

  mapTablesToTypes(tables: Element[]): Type[] {
    return tables.map((v: Element) => this.castTableToType(v))
  }

  castListLinkToMatch(link: Element): string {
    return this.main.cheerio(link).text()
  }

  mapListLinksToMatches(links: Element[]): string[] {
    return links.map((v: Element) => this.castListLinkToMatch(v))
  }

  castListToType(list: Element): Type {
    let links: Element[], type: Type

    links = this.main.cheerio('li > a', list).toArray()

    type = {} as Type
    type.name = this.findListName(list)
    type.description = this.findListDescription(list)
    type.fields = []
    type.matches = this.mapListLinksToMatches(links)

    return type
  }

  mapListsToTypes(lists: Element[]): Type[] {
    return lists.map((v: Element) => this.castListToType(v))
  }

  castParagraphToType(paragraph: Element): Type {
    let type: Type

    type = {} as Type
    type.name = this.main.cheerio(paragraph).prev('h4').text()
    type.description = this.main.cheerio(paragraph).text()
    type.fields = []
    type.matches = []

    return type
  }

  mapParagraphsToTypes(paragraphs: Element[]): Type[] {
    return paragraphs.map((v: Element) => this.castParagraphToType(v))
  }

  castParagraphsToString(paragraphs: Element[]): string {
    return paragraphs
      .reduce((r: string[], v: Element) => {
        let text: string

        text = this.main.cheerio(v).text()
        if (text.trim().length <= 0) return r

        r.push(text)

        return r
      }, [])
      .join('\n')
  }

  findTableName(table: Element): string {
    let paragraphs: Element[], heading: Cheerio<Element> | undefined

    paragraphs = this.main.cheerio(table).prevUntil('h4', 'p').toArray()

    if (paragraphs.length > 0) {
      heading = this.main.cheerio(paragraphs.at(-1)).prev('h4')
    } else {
      heading = this.main.cheerio(table).prev('h4')
    }

    return heading.text()
  }

  findListName(list: Element): string {
    return this.findTableName(list)
  }

  findTableDescription(table: Element): string {
    let paragraphs: Element[]

    paragraphs = this.main.cheerio(table).prevUntil('h4', 'p').toArray()
    if (paragraphs.length <= 0) return ''

    return this.castParagraphsToString(paragraphs)
  }

  findListDescription(list: Element): string {
    return this.findTableDescription(list)
  }
}
