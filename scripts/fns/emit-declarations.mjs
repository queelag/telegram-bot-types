import { execSync } from 'child_process'

export async function emitDeclarations() {
  try {
    execSync('npm exec tsc', { stdio: 'inherit' })
    execSync('node index.js', { stdio: 'inherit' })
  } catch (e) {
    return e
  }
}
