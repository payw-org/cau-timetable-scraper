export default class Print {
  static ln(msg: string, lineBreak: boolean = false) {
    process.stdout.write(`${msg}${lineBreak ? '\n' : ''}`)
  }

  static done(lineBreak: boolean = true) {
    Print.ln('✅', lineBreak)
  }
}
