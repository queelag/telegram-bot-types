export async function emitDeclarations() {
  let main

  const { Main } = await import('../../dist/index.js')

  main = new Main()

  await main.initialize()

  main.list.initialize()
  main.table.initialize()
  main.paragraph.initialize()
  main.parser.initialize()

  await main.writer.typescript()
}
