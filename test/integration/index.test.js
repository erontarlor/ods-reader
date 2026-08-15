import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTestFilePath, assertCellContent, assertRepeatedCellContents} from '../TestUtils.js';
import OdsReader from '../../src/index.js';

test('index exports proper class OdsReader', async () => {
  const cells = [];
  await OdsReader.readFile(buildTestFilePath('integration', 'everything.ods'), (cell) => {
    cells.push(cell);
  });
  assert.equal(cells.length, 34);
  assertCellContent(cells.shift(), {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [
    {text: 'Hello ', style: {fontWeight:        null,     fontStyle: null,     underlineStyle: null, strikeThroughType: null, textColor: null}},
    {text: 'World',  style: {fontWeight:        'bold',   fontStyle: 'italic'}},
    {text: ' ',      style: {fontWeight:        'normal', fontStyle: 'normal', underlineStyle: null, strikeThroughType: null, textColor: null}},
    {text: 'Rich',   style: {underlineStyle:    'solid',  textColor: '#800000'}},
    {text: ' ',      style: {fontWeight:        'normal', fontStyle: 'normal', underlineStyle: null, strikeThroughType: null, textColor: null}},
    {text: 'Text',   style: {strikeThroughType: 'single', textColor: '#008000'}}
  ]});
  assertCellContent(cells.shift(), {sheetName: 'Sheet1', row: 0, column: 1, covered: false, richText: []});
  assertCellContent(cells.shift(), {sheetName: 'Sheet1', row: 0, column: 2, covered: false, richText: [{text: 'Link',                     style: {hyperlink: 'https://www.example.com/'}}]});
  assertCellContent(cells.shift(), {sheetName: 'Sheet1', row: 1, column: 0, covered: false, richText: [{text: 'Paragraph 1\nParagraph 2', style: {}}]});
  assertCellContent(cells.shift(), {sheetName: 'Sheet1', row: 1, column: 1, covered: false, richText: []});
  assertCellContent(cells.shift(), {sheetName: 'Sheet1', row: 1, column: 2, covered: false, richText: []});
  assertCellContent(cells.shift(), {sheetName: 'Sheet1', row: 2, column: 0, covered: false, richText: [{text: 'Merge',                    style: {horizontalAlign: 'center', verticalAlign: 'middle'}}]});
  assertCellContent(cells.shift(), {sheetName: 'Sheet1', row: 2, column: 1, covered: true,  richText: [{text: 'Merge',                    style: {horizontalAlign: 'center', verticalAlign: 'middle'}}]});
  assertCellContent(cells.shift(), {sheetName: 'Sheet1', row: 2, column: 2, covered: false, richText: [{text: '😊',                       style: {}}]});
  assertRepeatedCellContents(cells, 0, 0, 2, 5, {sheetName: 'Sheet2', covered: false, richText: [{text: 'Repeat', style: {}}]});
//  TODO: Also consider and merge row and column styles to get backgroundColor
//assertRepeatedCellContents(cells, 2, 0, 1, 5, {sheetName: 'Sheet2', covered: false, richText: [{text: 'Repeat', style: {fontSize: '20pt', backgroundColor: '#ffff00'}}]});
  assertRepeatedCellContents(cells, 2, 0, 1, 5, {sheetName: 'Sheet2', covered: false, richText: [{text: 'Repeat', style: {fontSize: '20pt'}}]});
  assertRepeatedCellContents(cells, 3, 0, 2, 5, {sheetName: 'Sheet2', covered: false, richText: [{text: 'Repeat', style: {}}]});
});
