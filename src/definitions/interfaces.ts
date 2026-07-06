export interface Field {
  description: string
  name: string
  type: string
}

export interface Type {
  description: string
  fields: Field[]
  matches: string[]
  name: string
}

export interface Parameter {
  description: string
  name: string
  required: boolean
  type: string
}

export interface Method {
  description: string
  name: string
  parameters: Parameter[]
}
