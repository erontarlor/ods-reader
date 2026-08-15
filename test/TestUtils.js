import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import Cell from '../src/Cell.js';
import Style from '../src/Style.js';
import StyleResolver from '../src/StyleResolver.js';

export class MockCellBuilder {
  constructor() {
    this.beginSheetCalls = 0;
    this.cells = [];
  }

  beginSheet() {
    this.beginSheetCalls++;
  }

  emitCell(cell) {
    this.cells.push(cell);
  }

  emitCoveredCell(cell) {
    this.cells.push(cell);
  }
}

export function readTestFile(name) {
  return readFileSync(buildTestFilePath('unit', name), 'utf8');
}

export function buildTestFilePath(type, name) {
  return path.join('test', type, 'data', name)
}

export function createStyleResolver(...styles) {
  const map = new Map();
  for(const style of styles) {
    map.set(style.name, style);
  }
  return new StyleResolver(map);
}

export function createCell() {
  const cell = new Cell();
  cell.sheetName  = 'Sheet1';
  cell.rawText    = 'Hello';
  cell.richText   = [{text: 'Hello', style: new Style()}];
  return cell;
}

export function createCoveredCell(row, column) {
  const cell = new Cell();
  cell.sheetName    = 'Sheet1';
  cell.row          = row;
  cell.column       = column;
  cell.masterRow    = row;
  cell.masterColumn = column;
  cell.covered      = true;
  return cell;
}

export function createStyle(name, family, horizontalAlign, verticalAlign, fontWeight) {
  const style = new Style();
  style.name            = name;
  style.family          = family;
  style.horizontalAlign = horizontalAlign;
  style.verticalAlign   = verticalAlign;
  style.fontWeight      = fontWeight;
  return style;
}

export function assertBuilderContents(builder, sheetCount, targetCells) {
  assert.equal(builder.beginSheetCalls, sheetCount);
  assertCellContents(builder.cells, targetCells)
}

export function assertCellContents(cells, targetCells) {
  assert.equal(cells.length, targetCells.length);
  for(let index = 0; index < targetCells.length; index++) {
    assertCellContent(cells[index], targetCells[index]);
  }
}

export function assertRepeatedCellContents(cells, startRow, startColumn, rows, columns, targetCell) {
  for(let row = 0; row < rows; row++) {
    for(let column = 0; column < columns; column++) {
      targetCell.row    = startRow+row;
      targetCell.column = startColumn+column;
      assertCellContent(cells[columns*targetCell.row+targetCell.column], targetCell);
    }
  }
}

export function assertCellContent(cell, targetCell) {
  for (const [key, targetValue] of Object.entries(targetCell)) {
    key === 'richText' ? assertCellRichText(cell[key], targetValue) : Array.isArray(targetValue) ? assert.deepEqual(cell[key], targetValue) : assert.equal(cell[key], targetValue);
  }
}

export function assertCellRichText(richText, targetRichText) {
  assert.equal(richText.length, targetRichText.length);
  for(let index = 0; index < targetRichText.length; index++) {
    assert.equal   (richText[index].text,  targetRichText[index].text);
    assertCellStyle(richText[index].style, targetRichText[index].style);
  }
}

export function assertCellStyle(style, targetStyle) {
  for (const [key, targetValue] of Object.entries(targetStyle)) {
    Array.isArray(targetValue) ? assert.deepEqual(style[key], targetValue) : assert.equal(style[key], targetValue);
  }
}

export function assertStylesAt(styleAt, startIndex, endIndex, targetStyle) {
  for(let index = startIndex; index < endIndex; index++) {
    assert.equal(styleAt[index], targetStyle);
  }
}
