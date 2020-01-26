import puppeteer from 'puppeteer'
import { signIn } from './sign-in'
import { scrapeTimetable } from './scrape-timetable'
import { Account } from './types'
import { atomize } from './atomize'
import { parse } from './parse'
import fs from 'fs'

const CTTS = async (account: Account) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  })

  const page = await browser.newPage()
  page.setViewport({
    width: 1280,
    height: 800
  })

  page.setMaxListeners(Infinity)

  page.on('console', msg => {
    for (let i = 0; i < msg.args().length; ++i) {
      console.log(`${msg.args()[i]}`)
    }
  })

  if (!fs.existsSync('data')) {
    fs.mkdirSync('data')
  }

  await signIn(page, account)
  const lectures = parse(atomize(await scrapeTimetable(page)))

  browser.close()

  return lectures
}

export { CTTS }
