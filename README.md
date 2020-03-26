<h1 align="center">CAU Timetable Scraper</h1>

<p align="center">A Node.js CAU timetable scraping module for <b>eodiro</b> written in TypeScript</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@payw/cau-timetable-scraper">
    <img src="https://img.shields.io/npm/v/@payw/cau-timetable-scraper">
  </a>
  <a href="https://github.com/paywteam/cau-timetable-scraper/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/paywteam/cau-timetable-scraper?style=flat">
  </a>
</p>

---

## Installation

```zsh
% npm install @payw/cau-timetable-scraper
```

## v2.1.0 Migration

In `v2.1.0`, a new feature has been arrived where **CTTS** returns lectures along with the colleges and majors information separately.

```ts
// v2.0.x
const lectures = CTTS({})

// v2.1.x
// Object destructuing
const { lectures, colleges } = CTTS({})

// Or
const scrapeResult = CTTS({})
const lectures = scrapeResult.lectures
const colleges = scrapeResult.colleges
```

## API

```ts
import { CTTS } from '@payw/cau-timetable-scraper'

const { lectures, colleges } = CTTS({
  id: 'CAU Portal ID',
  pw: 'password',
})
```

## Types

### RefinedLecture

The `CTTS` function returns an array of refined lectures.

| key       | type         |
| --------- | ------------ |
| coverages | `Coverage[]` |
| year      | `number`     |
| semester  | `string`     |
| campus    | `string`     |
| college   | `string`     |
| subject   | `string`     |
| grade     | `string`     |
| course    | `string`     |
| section   | `string`     |
| code      | `string`     |
| time      | `string`     |
| name      | `string`     |
| credit    | `string`     |
| professor | `string`     |
| closed    | `string`     |
| schedule  | `string`     |
| building  | `string`     |
| room      | `string`     |
| periods   | `Period[]`   |
| flex      | `string`     |
| note      | `string`     |

### Coverage

| key     | type     |
| ------- | -------- |
| course  | `string` |
| college | `string` |
| major   | `string` |

### Period

| key    | type                                              |
| ------ | ------------------------------------------------- |
| day    | `'mon'\|'tue'\|'wed'\|'thu'\|'fri'\|'sat'\|'sun'` |
| startH | `number`                                          |
| startM | `number`                                          |
| endH   | `number`                                          |
| endM   | `number`                                          |

Check out [type definitions](https://github.com/paywteam/cau-timetable-scraper/blob/master/src/types/index.ts) for more information.
