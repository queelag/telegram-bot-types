import Main from '../src'
import fs from 'fs-extra'

describe('Main', () => {
  let main: Main

  beforeAll(async () => {
    main = new Main()
    await main.initialize()
  })

  it('finds all lists', () => {
    main.list.types = main.list.findTypes()
    expect(main.list.types.length).toBeGreaterThan(0)
  })

  it('finds all tables', () => {
    main.table.all = main.table.findAll()
    expect(main.table.all.length).toBeGreaterThan(0)
  })

  it('filters tables by the first value inside the head', () => {
    main.table.methods = main.table.findMethods()
    main.table.types = main.table.findTypes()

    expect(main.table.methods.length).toBeGreaterThan(0)
    expect(main.table.methods.length).toBeLessThan(main.table.all.length)
    expect(main.table.types.length).toBeGreaterThan(0)
    expect(main.table.types.length).toBeLessThan(main.table.all.length)
  })

  it('parses lists and tables', () => {
    main.parser.initialize()

    expect(main.parser.methods.length).toBeGreaterThan(0)
    expect(main.parser.types.length).toBeGreaterThan(0)
  })

  it('writes the typescript definitions', () => {
    main.writer.typescript()

    expect(fs.readFileSync('dist/index.d.ts').length).toBeGreaterThan(0)
  })
})
