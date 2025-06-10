import { mkdir, writeFile } from 'fs/promises'
import { Child } from '../modules/child'

export class Writer extends Child {
  async typescript(): Promise<void> {
    let out: string[] = []

    for (let type of this.main.parser.types) {
      out.push(`/* ${type.description} */`)
      out.push(`export type ${type.name} = `)

      if (type.matches.length <= 0) {
        out[out.length - 1] += '{'
      }

      for (let field of type.fields) {
        out.push(`  /* ${field.description} */`)
        out.push(
          `  ${field.name}${field.description.includes('Optional') ? '?:' : ':'} ${this.telegramTypeToTypescript(field.type, field.description, field.name)}`
        )
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
        out.push(
          `  ${parameter.name}${parameter.required ? ':' : '?:'} ${this.telegramTypeToTypescript(parameter.type, parameter.description, parameter.name)}`
        )
      }

      out.push(`}`)
      out.push('')
    }

    await mkdir('./dist', { recursive: true })
    await writeFile('./dist/index.d.ts', out.join('\n'))
  }

  telegramTypeToTypescript(type: string, description?: string, name?: string): string {
    switch (true) {
      case type === 'Boolean':
        return 'boolean'
      case type === 'CallbackGame':
      case type === 'VoiceChatStarted':
        return 'any'
      case type === 'Float':
      case type === 'Float number':
      case type === 'Integer':
      case type === 'Integer number':
        if (description?.includes('52') && description.includes('64')) {
          return 'bigint | number'
        }

        switch (name) {
          case 'chat_id':
          case 'sender_chat_id':
          case 'user_id':
            return 'bigint | number'
          default:
            break
        }

        return 'number'
      case type === 'Integer or String':
        return 'bigint | number'
      case type === 'InputFile':
      case type === 'InputFile or String':
        return '(Blob & { lastModified: number; name: string; webkitRelativePath: string }) | string'
      case type === 'String':
        if (description?.includes('attach://<file_attach_name>')) {
          return '(Blob & { lastModified: number; name: string; webkitRelativePath: string }) | string'
        }

        return 'string'
      case type === 'True':
        return 'true'
      case type.includes('Array of'): {
        let arrayOfs: number, ands: number

        arrayOfs = (type.match(/Array of/g) ?? []).length
        ands = (type.match(/( and |,)/g) ?? []).length

        return (
          (ands > 0 ? '(' : '') +
          type
            .replace(/(Array of | and|,)/g, '')
            .split(' ')
            .reduce((r: string[], v: string) => [...r, this.telegramTypeToTypescript(v, description)], [])
            .join(' | ') +
          (ands > 0 ? ')' : '') +
          new Array(arrayOfs).fill('[]').reduce((r: string, v: string) => r + v, '')
        )
      }
      case type.includes(' or '):
        return type
          .replace(/ or/g, '')
          .split(' ')
          .reduce((r: string[], v: string) => [...r, this.telegramTypeToTypescript(v, description)], [])
          .join(' | ')
      default:
        return type
    }
  }
}
