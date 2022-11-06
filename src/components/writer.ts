import { mkdirSync, writeFileSync } from 'fs'
import { Child } from '../modules/child'

export class Writer extends Child {
  typescript(): void {
    let out: string[] = []

    for (let type of this.main.parser.types) {
      out.push(`/* ${type.description} */`)
      out.push(`export type ${type.name} = `)

      if (type.matches.length <= 0) {
        out[out.length - 1] += '{'
      }

      for (let field of type.fields) {
        out.push(`  /* ${field.description} */`)
        out.push(`  ${field.name}${field.description.includes('Optional') ? '?:' : ':'} ${this.telegramTypeToTypescript(field.type)}`)
      }

      if (type.matches.length > 0) {
        out[out.length - 1] += type.matches.join(' | ')
      }

      if (type.matches.length <= 0) {
        out.push(`}`)
      }

      out.push('')
    }

    for (let method of this.main.parser.methods) {
      out.push(`/* ${method.description} */`)
      out.push(`export type ${method.name} = {`)

      for (let parameter of method.parameters) {
        out.push(`  /* ${parameter.description} */`)
        out.push(`  ${parameter.name}${parameter.required ? ':' : '?:'} ${this.telegramTypeToTypescript(parameter.type)}`)
      }

      out.push(`}`)
      out.push('')
    }

    mkdirSync('./dist', { recursive: true })
    writeFileSync('./dist/index.d.ts', out.join('\n'))
  }

  telegramTypeToTypescript(type: string): string {
    switch (true) {
      case type === 'Integer':
        return 'number'
      case type.includes('Array of'):
        let arrayOfs: number, ands: number

        arrayOfs = (type.match(/Array of/g) || []).length
        ands = (type.match(/( and |,)/g) || []).length

        return (
          (ands > 0 ? '(' : '') +
          type
            .replace(/(Array of | and|,)/g, '')
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
        return '(Blob & { lastModified: number; name: string; webkitRelativePath: string }) | string'
      case type === 'CallbackGame':
      case type === 'VoiceChatStarted':
        return 'any'
      default:
        return type
    }
  }
}
