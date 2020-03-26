/**
 * Small utility for better printing
 */
export default class Print {
  /**
   * @param msg
   * @param lineBreak Whether to line break or not @default false
   */
  static ln(msg: string, lineBreak: boolean = false) {
    process.stdout.write(`${msg}${lineBreak ? '\n' : ''}`)
  }

  /**
   * @param lineBreak @default true
   */
  static done(lineBreak: boolean = true) {
    Print.ln('✅', lineBreak)
  }
}
