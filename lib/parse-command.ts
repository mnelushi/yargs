export function parseCommand (cmd: string) {
  const extraSpacesStrippedCommand = cmd.replace(/\s{2,}/g, ' ')
  const splitCommand = extraSpacesStrippedCommand.split(/\s+(?![^[]*]|[^<]*>)/)
  const bregex = /\.*[\][<>]/g

  const firstCommand = splitCommand.shift()
  if (!firstCommand) throw new Error(`No command found in: ${cmd}`)

  const parsedCommand: ParsedCommand = {
    cmd: firstCommand.replace(bregex, ''),
    demanded: [],
    optional: []
  }
  splitCommand.forEach((cmd, i) => {
    let variadic = false
    cmd = cmd.replace(/\s/g, '')
    if (/\.+[\]>]/.test(cmd) && i === splitCommand.length - 1) variadic = true
    if (/^\[/.test(cmd)) {
      parsedCommand.optional.push({
        cmd: cmd.replace(bregex, '').split('|'),
        variadic
      })
    } else {
      parsedCommand.demanded.push({
        cmd: cmd.replace(bregex, '').split('|'),
        variadic
      })
    }
  })
  return parsedCommand
}

export interface ParsedCommand {
  cmd: string
  demanded: Positional[]
  optional: Positional[]
}

interface Positional {
  cmd: string[]
  variadic: boolean
}
