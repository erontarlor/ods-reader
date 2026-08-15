# ODS Reader

[![npm version](https://img.shields.io/npm/v/ods-reader.svg)](https://www.npmjs.com/package/ods-reader) [![Node.js CI](https://github.com/erontarlor/ods-reader/actions/workflows/node.js.yml/badge.svg)](https://github.com/erontarlor/ods-reader/actions/workflows/node.js.yml) [![Coverage Status](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/erontarlor/ods-reader/main/coverage-badge.json)](https://github.com/erontarlor/ods-reader) [![License](https://img.shields.io/github/license/erontarlor/ods-reader.svg)](LICENSE)

A high-performance Node.js library for reading **OpenDocument Spreadsheet (ODS)** files with full **Rich Text** support.

Unlike most ODS readers, this library resolves text styles, nested spans and inherited formatting and returns each cell as a sequence of rich text segments.

## Features

- ✔ Read ODS files without LibreOffice or OpenOffice
- ✔ Streaming XML parser with low memory consumption
- ✔ Full Rich Text support
- ✔ Nested `<text:span>` elements
- ✔ Paragraph styles
- ✔ Cell styles
- ✔ Automatic style inheritance
- ✔ Hyperlinks
- ✔ Line breaks and tabs
- ✔ Merged cells (`rowSpan` / `colSpan`)
- ✔ Repeated rows and columns
- ✔ Covered cells automatically resolved
- ✔ Modern ES Module API

---

## Installation

```bash
npm install ods-reader
```

---

## Quick Start

```javascript
import { ODSReader } from 'ods-reader';

await ODSReader.read('example.ods', cell => {

  // Basic cell data
  console.log(cell.sheetName, cell.row, cell.column, cell.plainText);

  // Detailed rich text segments with styles
  for (const segment of cell.richText) {
    console.log(segment.text, segment.style);
  }

  // Effective style for first character in plain text string
  console.log(cell.styleAt[0]);
});
```

---

## Example

Assume the following spreadsheet cell:

|       A1        |
|-----------------|
| Hello **World** |

The callback receives

```javascript
{
  sheetName: 'Sheet1',
  row:       0,
  column:    0,
  plainText: 'Hello World',
  richText: [
    {text: 'Hello ', style: {}},
    {text: 'World',  style: {fontWeight: 'bold'}}
  ],
  styleAt: [{}, {} {} {} {} {}, {fontWeight: 'bold'}, {fontWeight: 'bold'}, {fontWeight: 'bold'}, {fontWeight: 'bold'}, {fontWeight: 'bold'}]
}
```

No manual parsing of XML or style definitions is required.

---

## Unicode code points and graphemes

The returned fields `plainText` or `text` may contain characters called "unicode code points", that are shown as one character but consist of two UTF16 code units, or composed characters called "graphemes" that consist of several "unicode code points". If you know that your ODS file contains such characters, don't use `plainText.length` or `plainText.at()` to calculate indexes or access the single characters corresponding to the styles in the array `styleAt`, since those methods only handle UTF16 code units and will lead to wrong values. Use one of the methods below, instead.

```javascript
const char = plainText.codePointAt(5); // does only work for unicode code points, not for graphemes
const chars = [...plainText];          // does only work for unicode code points, not for graphemes
for(const char of plainText) {};       // does only work for unicode code points, not for graphemes
const segmenter = new Intl.Segmenter(undefined, {granularity: "grapheme"});
const chars = [...segmenter.segment(plainText)]; // also works for graphemes
```

---

## Documentation

The complete API documentation is generated automatically from the source code.

After generating it with

```bash
npm run docs
```

open

```
docs/index.html
```

in your browser.

---

## Architecture

```
styles.xml  content.xml  
     |        │    |
     ▼        ▼    |
    StylesParser   |
         │         |
         ▼         |
   StyleResolver   |
         │         |
         │         |
         │         |
         │         |
         ▼         ▼
        ContentParser
              │
              ▼
         CellBuilder
              │
              ▼
        callback(Cell)
```

### Processing Pipeline

1. The ODS archive is opened.
2. Styles from `styles.xml` and `content.xml` are parsed using a streaming XML parser and all styles are resolved hierarchically.
3. Table structure in `content.xml` is parsed using a streaming XML parser.
4. Rich text segments are collected and corresponding styles are resolved.
5. Cell spans and repeated cells are resolved.
6. The callback receives one fully resolved `Cell` object for every logical spreadsheet cell.

---

## Project Status

The current implementation supports

- Rich Text
- Paragraph styles
- Character styles
- Cell styles
- Style inheritance
- Hyperlinks
- Paragraph breaks
- Tabs
- Multiple spaces
- Repeated rows
- Repeated columns
- Merged cells
- Covered cells

Additional spreadsheet features such as formulas, cell values and comments will be added in future releases.

---

## License

MIT License
````
