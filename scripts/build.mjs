import { cp, rm, writeFile } from 'fs/promises'
import { bundle } from './fns/bundle.mjs'
import { emitDeclarations } from './fns/emit-declarations.mjs'
import { writeDistPackageJSON } from './fns/write-dist-package-json.mjs'

await rm('dist', { force: true, recursive: true })

await bundle()
await emitDeclarations()
await writeDistPackageJSON()

await cp('LICENSE', 'dist/LICENSE')
await cp('README.md', 'dist/README.md')

await writeFile('dist/index.cjs', '')
await writeFile('dist/index.js', '')

await rm('dist/components', { force: true, recursive: true })
await rm('dist/definitions', { force: true, recursive: true })
await rm('dist/modules', { force: true, recursive: true })
