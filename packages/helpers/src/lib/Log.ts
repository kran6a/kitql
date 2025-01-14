import { bold, colorProcess, greenBright, magenta, redBright } from './colors/index.js'

export class Log {
  private toolName: string
  private levelsToShow: null | number
  private withDate: null | 'dateTime' | 'time'
  private prefixEmoji: string

  constructor(
    toolName: string,
    options?: {
      levelsToShow?: null | number
      withDate?: 'dateTime' | 'time'
      prefixEmoji?: string
    },
  ) {
    this.toolName = toolName
    this.levelsToShow = options?.levelsToShow ?? 3
    this.withDate = options?.withDate ?? null
    this.prefixEmoji = options?.prefixEmoji ?? ''
  }

  private buildStr(msg: string, withError: boolean, withSuccess: boolean, indent: string) {
    const table = []
    if (this.toolName) {
      table.push(String(magenta(`[${this.toolName}]`)))
    }

    // DateTime or Time or nothing
    if (this.withDate === 'dateTime') {
      table.push(String(magenta(`[${new Date().toISOString()}]`)))
    } else if (this.withDate === 'time') {
      table.push(String(magenta(`[${new Date().toISOString().split('T')[1]}]`)))
    }

    // Status icon or prefixEmoji
    if (withError) {
      table.push(bold(redBright('✘')))
    } else if (withSuccess) {
      table.push(bold(greenBright('✔')))
    } else {
      table.push(String(this.prefixEmoji))
    }

    table.push(indent)

    // prefix message with a space if there is already something in the table
    if (table.join('').length > 0) {
      table.push(` `)
    }
    table.push(String(msg))

    const str = table.join('')

    return colorProcess(str)

    // wrap it because we always unwrap after ;)
    return [str]
  }

  info(msg: string, conf?: { level?: number; withSuccess?: boolean }) {
    const level = conf?.level ?? 0
    const withSuccess = conf?.withSuccess ?? false

    if (this.levelsToShow !== null && level <= this.levelsToShow) {
      const indent = ' '.repeat(level)
      const built = this.buildStr(msg, false, withSuccess, indent)
      console.info(...built)
      return built
    }
    return null
  }

  success(msg: string, conf?: { level?: number }) {
    const level = conf?.level ?? 0
    return this.info(msg, { level, withSuccess: true })
  }

  error(msg: string) {
    const built = this.buildStr(msg, true, false, '')
    // Keep error to have the stacktrace in the browser
    console.error(...built)
    return built
  }
}
