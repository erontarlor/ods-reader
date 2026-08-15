import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTestFilePath, assertCellContents, assertRepeatedCellContents} from '../TestUtils.js';
import OdsReader from '../../src/OdsReader.js';

async function readTestFile(filename) {
  const cells = [];
  const path = buildTestFilePath('integration', filename);
  await OdsReader.readFile(path, (cell) => {
    cells.push(cell);
  });
  return cells;
}

test('OdsReader.readFile() reads a simple ODS file', async () => {
  const cells = await readTestFile('simple.ods');
  assertCellContents(cells, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello', style: {}}]},
    {sheetName: 'Sheet1', row: 0, column: 1, covered: false, richText: [{text: 'World', style: {}}]}
  ]);
});

test('OdsReader.readFile() reads an ODS file with paragraphs', async () => {
  const cells = await readTestFile('paragraphs.ods');
  assertCellContents(cells, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello\nWorld\n!', style: {}}]}
  ]);
});

test('OdsReader.readFile() reads an ODS file with empty cells', async () => {
  const cells = await readTestFile('empty-cells.ods');
  assertCellContents(cells, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello', style: {}}]},
    {sheetName: 'Sheet1', row: 0, column: 1, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 0, column: 2, covered: false, richText: [{text: 'World', style: {}}]},
    {sheetName: 'Sheet1', row: 1, column: 0, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 1, column: 1, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 1, column: 2, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 2, column: 0, covered: false, richText: [{text: 'World', style: {}}]},
    {sheetName: 'Sheet1', row: 2, column: 1, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 2, column: 2, covered: false, richText: [{text: 'Hello', style: {}}]}
  ]);
});

test('OdsReader.readFile() reads an ODS file with multiple sheets', async () => {
  const cells = await readTestFile('multi-sheet.ods');
  assertCellContents(cells, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello World 1', style: {}}]},
    {sheetName: 'Sheet2', row: 0, column: 0, covered: false, richText: [{text: 'Hello World 2', style: {}}]},
    {sheetName: 'Sheet3', row: 0, column: 0, covered: false, richText: [{text: 'Hello World 3', style: {}}]}
  ]);
});

test('OdsReader.readFile() reads an ODS file with merged cells', async () => {
  const cells = await readTestFile('merged-cells.ods');
  assertCellContents(cells, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello', style: {}}]},
    {sheetName: 'Sheet1', row: 0, column: 1, covered: true,  richText: [{text: 'Hello', style: {}}]},
    {sheetName: 'Sheet1', row: 0, column: 2, covered: false, richText: [{text: 'World', style: {}}]},
    {sheetName: 'Sheet1', row: 1, column: 0, covered: true,  richText: [{text: 'Hello', style: {}}]},
    {sheetName: 'Sheet1', row: 1, column: 1, covered: true,  richText: [{text: 'Hello', style: {}}]},
    {sheetName: 'Sheet1', row: 1, column: 2, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 2, column: 0, covered: false, richText: [{text: 'World', style: {}}]},
    {sheetName: 'Sheet1', row: 2, column: 1, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 2, column: 2, covered: false, richText: []}
  ]);
});

test('OdsReader.readFile() reads an ODS file with repeated cells', async () => {
  const cells = await readTestFile('repeated-cells.ods');
  assertRepeatedCellContents(cells, 0, 0, 10, 10, {sheetName: 'Sheet1', covered: false, richText: [{text: 'Hello World', style: {}}]});
});

test('OdsReader.readFile() reads an ODS file with unicode', async () => {
  const cells = await readTestFile('unicode.ods');
  assertCellContents(cells, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'äöü',     style: {}}]},
    {sheetName: 'Sheet1', row: 1, column: 0, covered: false, richText: [{text: 'ÄÖÜ',     style: {}}]},
    {sheetName: 'Sheet1', row: 2, column: 0, covered: false, richText: [{text: '€ £ ¥',   style: {}}]},
    {sheetName: 'Sheet1', row: 3, column: 0, covered: false, richText: [{text: '😊',      style: {}}]},
    {sheetName: 'Sheet1', row: 4, column: 0, covered: false, richText: [{text: '中文',     style: {}}]},
    {sheetName: 'Sheet1', row: 5, column: 0, covered: false, richText: [{text: '日本語',   style: {}}]},
    {sheetName: 'Sheet1', row: 6, column: 0, covered: false, richText: [{text: 'العربية', style: {}}]}
  ]);
});

test('OdsReader.readFile() reads an ODS file with rich text content', async () => {
  const cells = await readTestFile('rich-text.ods');
  assertCellContents(cells, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello ', style: {}}, {text: 'World', style: {fontWeight: 'bold'}}, {text: '!', style: {fontStyle: 'italic'}}]}
  ]);
});

test('OdsReader.readFile() reads an ODS file with styles', async () => {
  const cells = await readTestFile('styles.ods');
  assertCellContents(cells, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Bold',      style: {}}]},
    {sheetName: 'Sheet1', row: 1, column: 0, covered: false, richText: [{text: 'Italic',    style: {}}]},
    {sheetName: 'Sheet1', row: 2, column: 0, covered: false, richText: [{text: 'Underline', style: {}}]},
    {sheetName: 'Sheet1', row: 3, column: 0, covered: false, richText: [{text: 'Strike',    style: {}}]},
    {sheetName: 'Sheet1', row: 4, column: 0, covered: false, richText: [{text: 'Red',       style: {}}]},
    {sheetName: 'Sheet1', row: 5, column: 0, covered: false, richText: [{text: 'Blue',      style: {}}]},
    {sheetName: 'Sheet1', row: 6, column: 0, covered: false, richText: [{text: 'Font',      style: {}}]},
    {sheetName: 'Sheet1', row: 7, column: 0, covered: false, richText: [{text: 'Size',      style: {}}]}
  ]);
});

test('OdsReader.readFile() reads an ODS file with hyperlinks', async () => {
  const cells = await readTestFile('hyperlinks.ods');
  assertCellContents(cells, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello World', style: {}}]}
  ]);
});

test('OdsReader.readFile() throws an error for a broken ODS file', async () => {
  await assert.rejects(readTestFile('broken-zip.ods'), {name: 'Error', message: 'invalid zip data'});
});

test('OdsReader.readFile() throws an error for an ODS file with missing styles', async () => {
  await assert.rejects(readTestFile('missing-styles.ods'), {name: 'Error', message: 'Missing file "styles.xml" in ODS archive'});
});

test('OdsReader.readFile() throws an error for an ODS file missing content', async () => {
  await assert.rejects(readTestFile('missing-content.ods'), {name: 'Error', message: 'Missing file "content.xml" in ODS archive'});
});

test('OdsReader.readFile() throws an error for an ODS file with invalid styles', async () => {
  await assert.rejects(readTestFile('invalid-styles.ods'), {name: 'Error', message: 'Unclosed root tag\nLine: 2\nColumn: 0\nChar: '});
});

test('OdsReader.readFile() throws an error for an ODS file with invalid content', async () => {
  await assert.rejects(readTestFile('invalid-content.ods'), {name: 'Error', message: 'Unclosed root tag\nLine: 2\nColumn: 0\nChar: '});
});

test('OdsReader.readFile() throws an error if filename is not a string', async () => {
  await assert.rejects(OdsReader.readFile(1, () => {}), {name: 'TypeError', message: 'filename must be a non-empty string'});
});

test('OdsReader.readFile() throws an error if filename is an empty string', async () => {
  await assert.rejects(OdsReader.readFile('', () => {}), {name: 'TypeError', message: 'filename must be a non-empty string'});
});

test('OdsReader.readFile() throws an error if callback is not a function', async () => {
  await assert.rejects(OdsReader.readFile(buildTestFilePath('integration', 'simple.ods'), 1), {name: 'TypeError', message: 'callback must be a function'});
});

test('OdsReader.readBuffer() throws an error if buffer is not of type Uint8Array', async () => {
  await assert.rejects(OdsReader.readBuffer(1, () => {}), {name: 'TypeError', message: 'buffer must be a Buffer or Uint8Array'});
});

test('OdsReader.readBuffer() throws an error if callback is not a function', async () => {
  await assert.rejects(OdsReader.readBuffer(new Uint8Array(), 1), {name: 'TypeError', message: 'callback must be a function'});
});
