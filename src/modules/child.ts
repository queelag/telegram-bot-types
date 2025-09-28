import type { Main } from '../index.js'

export class Child {
  protected main: Main

  constructor(main: Main) {
    this.main = main
  }
}
