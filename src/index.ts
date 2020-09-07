import { Account, ScrapeOptions } from './types'

import { atomize } from './atomize'
import fs from 'fs'
import { loopCoverages } from './loop-coverages'
import { parse } from './parse'
import puppeteer from 'puppeteer'
import { signIn } from './sign-in'

const CTTS = async (account: Account, scrapeOptions: ScrapeOptions) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  })

  const page = await browser.newPage()
  page.setViewport({
    width: 1280,
    height: 800,
  })

  if (!fs.existsSync('data')) {
    fs.mkdirSync('data')
  }

  try {
    await signIn(page, account)
  } catch (err) {
    // Clear page and browser instance
    await page.close()
    await browser.close()
    throw new Error('Login timeout')
  }
  const result = await loopCoverages(page, scrapeOptions)
  const colleges = result.colleges
  const lectures = parse(atomize(result.lectures))

  await browser.close()

  return {
    lectures,
    colleges,
  }
}

export { CTTS }
