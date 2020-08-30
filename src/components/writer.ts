import Child from '../modules/child'
import fs from 'fs-extra'
import { Method, Parameter, Type, Field } from '../definitions/types'

class Writer extends Child {
  typescript(): void {
    let out: string[] = []

    this.main.parser.types.forEach((v: Type) => {
      out.push(`/* ${v.description} */`)
      out.push(`export type ${v.name} = `)

      if (v.matches.length <= 0) out[out.length - 1] += '{'

      v.fields.forEach((v: Field) => {
        out.push(`  /* ${v.description} */`)
        out.push(`  ${v.name}: ${this.telegramTypeToTypescript(v.type)}`)
      })

      if (v.matches.length > 0) out[out.length - 1] += v.matches.join(' | ')

      if (v.matches.length <= 0) out.push(`}`)

      out.push('')
    })

    this.main.parser.methods.forEach((v: Method) => {
      out.push(`/* ${v.description} */`)
      out.push(`export type ${v.name} = {`)

      v.parameters.forEach((v: Parameter) => {
        out.push(`  /* ${v.description} */`)
        out.push(`  ${v.name}${v.required ? ':' : '?:'} ${this.telegramTypeToTypescript(v.type)}`)
      })

      out.push(`}`)
      out.push('')
    })

    fs.writeFileSync('dist/index.d.ts', out.join('\n'))
  }

  telegramTypeToTypescript(type: string): string {
    switch (true) {
      case type === 'Integer':
        return 'number'
      case type.includes('Array of'):
        let arrayOfs: number, ands: number

        arrayOfs = (type.match(/Array of/g) || []).length
        ands = (type.match(/ and /g) || []).length

        return (
          (ands > 0 ? '(' : '') +
          type
            .replace(/(Array of | and)/g, '')
            .split(' ')
            .reduce((r: string[], v: string) => [...r, this.telegramTypeToTypescript(v)], [])
            .join(' | ') +
          (ands > 0 ? ')' : '') +
          new Array(arrayOfs).fill('[]').reduce((r: string, v: string) => r + v, '')
        )
      case type === 'String':
        return 'string'
      case type.includes(' or '):
        return type
          .replace(/ or/g, '')
          .split(' ')
          .reduce((r: string[], v: string) => [...r, this.telegramTypeToTypescript(v)], [])
          .join(' | ')
      case type === 'Boolean':
        return 'boolean'
      case type === 'Float number':
        return 'number'
      case type === 'Float':
        return 'number'
      case type === 'True':
        return 'true'
      case type === 'InputFile':
        return 'Buffer | string'
      case type === 'CallbackGame':
        return 'any'
      default:
        return type
    }
  }
}

export default Writer
