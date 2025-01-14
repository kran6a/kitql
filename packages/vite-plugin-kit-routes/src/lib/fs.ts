import { readdirSync } from 'fs'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join, relative } from 'path'

export function read(pathFile: string) {
  try {
    return readFileSync(pathFile, { encoding: 'utf8' })
  } catch (error) {}
  return null
}

export function write(pathFile: string, data: string[]) {
  const fullDataToWrite = Array.isArray(data) ? data.join('\n') : data

  // createFolderIfNotExists
  mkdirSync(dirname(pathFile), { recursive: true })

  // Don't write if nothing changed!
  if (existsSync(pathFile)) {
    const currentFileData = read(pathFile)
    if (fullDataToWrite === currentFileData) {
      return false
    }
  }
  writeFileSync(join(pathFile), fullDataToWrite)
  return true
}

export function getFilesUnder(rootFolder: string) {
  const files: string[] = []

  function traverseDirectory(dir: string) {
    const entries = readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        traverseDirectory(fullPath)
      } else {
        const relativePath = relative(rootFolder, fullPath)
        files.push(relativePath)
      }
    }
  }

  traverseDirectory(rootFolder)
  return files
}
