import test from 'node:test';
import assert from 'node:assert/strict';
import Cell from '../../src/Cell.js';

test('Cell constructor initializes default values', () => {
  const cell = new Cell();
  assert.equal    (cell.sheetName,    null);
  assert.equal    (cell.row,          0);
  assert.equal    (cell.column,       0);
  assert.equal    (cell.plainText,    '');
  assert.deepEqual(cell.richText,     []);
  assert.deepEqual(cell.styleAt,      []);
  assert.equal    (cell.rowSpan,      1);
  assert.equal    (cell.columnSpan,   1);
  assert.equal    (cell.masterRow,    0);
  assert.equal    (cell.masterColumn, 0);
  assert.equal    (cell.value,        null);
  assert.equal    (cell.formula,      null);
  assert.equal    (cell.valueType,    null);
  assert.equal    (cell.comment,      null);
  assert.equal    (cell.covered,      false);
});

test('Cell.clone() creates a shallow copy', () => {
  const cell = new Cell();
  cell.sheetName  = 'sheet';
  cell.row        = 1;
  cell.column     = 2;
  cell.plainText  = 'text1';
  cell.richText   = [{text: 'text1', style: {}}];
  cell.styleAt    = [{}];
  const copy = cell.clone();
  assert.notStrictEqual(copy,             cell);
  assert.equal         (copy.sheetName,  'sheet');
  assert.equal         (copy.row,        1);
  assert.equal         (copy.column,     2);
  assert.equal         (copy.plainText,  cell.plainText);
  assert.equal         (copy.richText,   cell.richText);
  assert.equal         (copy.styleAt,    cell.styleAt);
});
