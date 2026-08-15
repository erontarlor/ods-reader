import test from 'node:test';
import {createCell, createCoveredCell, assertCellContents} from '../TestUtils.js';
import CellBuilder from '../../src/CellBuilder.js';

function createCellBuilder(cells) {
  return new CellBuilder((cell) => {
    cells.push(cell);
  }).beginSheet();
}

test('CellBuilder.emitCell() emits normal cell', () => {
  const cell = createCell();
  const cells = [];
  createCellBuilder(cells).emitCell(cell);
  assertCellContents(cells, [{sheetName: 'Sheet1', row: 0, column: 0, richText: [{text: 'Hello', style: {}}], rowSpan: 1, columnSpan: 1, masterRow: 0, masterColumn: 0, covered: false}]);
});

test('CellBuilder.emitCoveredCell() resolves horizontally covered cells', () => {
  const cell = createCell();
  cell.columnSpan = 2;
  const coveredCellEast = createCoveredCell(0, 1);
  const cells = [];
  createCellBuilder(cells).emitCell(cell).emitCoveredCell(coveredCellEast);
  assertCellContents(cells, [
    {sheetName: 'Sheet1', row: 0, column: 0, richText: [{text: 'Hello', style: {}}], rowSpan: 1, columnSpan: 2, masterRow: 0, masterColumn: 0, covered: false},
    {sheetName: 'Sheet1', row: 0, column: 1, richText: [{text: 'Hello', style: {}}], rowSpan: 1, columnSpan: 2, masterRow: 0, masterColumn: 0, covered: true}
  ]);
});

test('CellBuilder.emitCoveredCell() resolves vertically covered cells', () => {
  const cell = createCell();
  cell.rowSpan = 2;
  const coveredCellSouth = createCoveredCell(1, 0);
  const cells = [];
  createCellBuilder(cells).emitCell(cell).emitCoveredCell(coveredCellSouth);
  assertCellContents(cells, [
    {sheetName: 'Sheet1', row: 0, column: 0, richText: [{text: 'Hello', style: {}}], rowSpan: 2, columnSpan: 1, masterRow: 0, masterColumn: 0, covered: false},
    {sheetName: 'Sheet1', row: 1, column: 0, richText: [{text: 'Hello', style: {}}], rowSpan: 2, columnSpan: 1, masterRow: 0, masterColumn: 0, covered: true}
  ]);
});

test('CellBuilder.emitCoveredCell() resolves horizontally and vertically covered cells', () => {
  const cell = createCell();
  cell.rowSpan    = 2;
  cell.columnSpan = 2;
  const coveredCellEast = createCoveredCell(0, 1);
  const coveredCellSouth = createCoveredCell(1, 0);
  const coveredCellSouthEast = createCoveredCell(1, 1);
  const cells = [];
  createCellBuilder(cells).emitCell(cell).emitCoveredCell(coveredCellEast).emitCoveredCell(coveredCellSouth).emitCoveredCell(coveredCellSouthEast);
  assertCellContents(cells, [
    {sheetName: 'Sheet1', row: 0, column: 0, richText: [{text: 'Hello', style: {}}], rowSpan: 2, columnSpan: 2, masterRow: 0, masterColumn: 0, covered: false},
    {sheetName: 'Sheet1', row: 0, column: 1, richText: [{text: 'Hello', style: {}}], rowSpan: 2, columnSpan: 2, masterRow: 0, masterColumn: 0, covered: true},
    {sheetName: 'Sheet1', row: 1, column: 0, richText: [{text: 'Hello', style: {}}], rowSpan: 2, columnSpan: 2, masterRow: 0, masterColumn: 0, covered: true},
    {sheetName: 'Sheet1', row: 1, column: 1, richText: [{text: 'Hello', style: {}}], rowSpan: 2, columnSpan: 2, masterRow: 0, masterColumn: 0, covered: true}
  ]);
});

test('CellBuilder.emitCoveredCell() handles invalid covered cells', () => {
    const cells = [];
    const coveredCell = createCoveredCell(5, 5);
    createCellBuilder(cells).emitCoveredCell(coveredCell);
    assertCellContents(cells, [{sheetName: 'Sheet1', row: 5, column: 5, richText: [], rowSpan: 1, columnSpan: 1, masterRow: 5, masterColumn: 5, covered: true}]);
});

test('CellBuilder.emitCoveredCell() clears covered cells on new sheet', () => {
  const cell = createCell();
  cell.rowSpan    = 2;
  cell.columnSpan = 2;
  const coveredCell = createCoveredCell(5, 5);
  const cells = [];
  createCellBuilder(cells).emitCell(cell).beginSheet().emitCoveredCell(coveredCell);
  assertCellContents(cells, [
    {sheetName: 'Sheet1', row: 0, column: 0, richText: [{text: 'Hello', style: {}}], rowSpan: 2, columnSpan: 2, masterRow: 0, masterColumn: 0, covered: false},
    {sheetName: 'Sheet1', row: 5, column: 5, richText: [],                           rowSpan: 1, columnSpan: 1, masterRow: 5, masterColumn: 5, covered: true}
  ]);
});
