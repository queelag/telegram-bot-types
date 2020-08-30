const { uniq } = require('lodash')

const Main = require('./dist/index').default

const main = new Main()

async function run() {
  await main.initialize()

  main.list.initialize()
  main.table.initialize()
  main.parser.initialize()

  main.writer.typescript()
}

run()
