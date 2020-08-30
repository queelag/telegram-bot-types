export type Field = {
  name: string
  type: string
  description: string
}

export type Type = {
  name: string
  description: string
  fields: Field[]
  matches: string[]
}

export type Parameter = {
  name: string
  type: string
  required: boolean
  description: string
}

export type Method = {
  name: string
  description: string
  parameters: Parameter[]
}
