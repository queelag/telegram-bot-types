const Main = require('./dist/index').default

const main = new Main()

async function run() {
  await main.initialize()

  main.list.initialize()
  main.table.initialize()
  main.paragraph.initialize()
  main.parser.initialize()

  await main.writer.typescript()
}

run()
