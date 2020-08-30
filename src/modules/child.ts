import Main from '..'

class Child {
  protected main: Main

  constructor(main: Main) {
    this.main = main
  }
}

export default Child
