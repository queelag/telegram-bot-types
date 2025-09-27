import { cp, rm } from 'fs/promises'
import { emitDeclarations } from './fns/emit-declarations.mjs'
import { writeDistPackageJSON } from './fns/write-dist-package-json.mjs'

await rm('dist', { force: true, recursive: true })

await emitDeclarations()
await writeDistPackageJSON()

await cp('LICENSE', 'dist/LICENSE')
await cp('README.md', 'dist/README.md')
