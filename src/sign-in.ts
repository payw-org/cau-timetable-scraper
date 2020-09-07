import { Page } from 'puppeteer'
import { Account } from './types'
import Print from './utils/print'
import { PendingXHR } from './modules/pending-xhr-puppeteer'

type signInSelectors = {
  idInput: string
  pwInput: string
  loginBtn: string
}

const selectors: signInSelectors = {
  idInput: '#txtUserID',
  pwInput: '#txtPwd',
  loginBtn: '.btn-login',
}

export const signIn = async (page: Page, account: Account) => {
  Print.ln('Loading sign in page...')

  const pendingXHR = new PendingXHR(page)

  await page.goto('https://mportal.cau.ac.kr/common/auth/SSOlogin.do')

  await page.waitForSelector(selectors.idInput)
  await page.waitForSelector(selectors.pwInput)

  Print.done()

  Print.ln('Evaluating account...')

  await page.evaluate(
    (selectors: signInSelectors, account: Account) => {
      ;(document.querySelector(selectors.idInput) as HTMLInputElement).value =
        account.id
      ;(document.querySelector(selectors.pwInput) as HTMLInputElement).value =
        account.pw
    },
    selectors,
    account
  )

  Print.done()

  await page.click(selectors.loginBtn)

  Print.ln('Signing in...')

  await page.waitForNavigation({
    waitUntil: ['domcontentloaded', 'load', 'networkidle0', 'networkidle2'],
  })
  await pendingXHR.waitForAllXhrFinished()

  Print.done()
}
