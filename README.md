<h1 align="center">CAU Timetable Scraper</h1>

<p align="center">A Node.js CAU timetable scraping module for <b>eodiro</b> written in TypeScript</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/@payw/cau-timetable-scraper">
  <img src="https://img.shields.io/github/license/paywteam/cau-timetable-scraper?style=flat">
</p>

---

## Installation

```zsh
% npm install @payw/cau-timetable-scraper
```

## API

```ts
import { CTTS } from '@payw/cau-timetable-scraper'

const lectures = CTTS({
  id: 'CAU Portal ID',
  pw: 'password'
})
```

## Types

### RefinedLecture

The `CTTS` function returns an array of refined lectures.

| key       | type       |
| --------- | ---------- |
| college   | `string`   |
| subject   | `string`   |
| grade     | `string`   |
| course    | `string`   |
| section   | `string`   |
| code      | `string`   |
| name      | `string`   |
| credit    | `string`   |
| professor | `string`   |
| closed    | `string`   |
| time      | `string`   |
| building  | `string`   |
| room      | `string`   |
| periods   | `Period[]` |
| flex      | `string`   |
| note      | `string`   |

### Period

| key    | type                                        |
| ------ | ------------------------------------------- |
| day    | `'mon'\|'tue'\|'wed'\|'thu'\|'fri'\|'sat'\|'sun'` |
| startH | `number`                                          |
| startM | `number`                                          |
| endH   | `number`                                          |
| endM   | `number`                                          |

Check out [type definitions](https://github.com/paywteam/cau-timetable-scraper/blob/master/src/types/index.ts) for more information.
