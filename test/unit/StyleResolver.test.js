import test from 'node:test';
import assert from 'node:assert/strict';
import Style from '../../src/Style.js';
import StyleResolver from '../../src/StyleResolver.js';

test('StyleResolver constructor creates an empty resolver', () => {
  assert.equal(new StyleResolver().getStyle('Test'), null);
});

test('StyleResolver.hasStyle() returns true for an existing style', () => {
  const style = new Style();
  style.name = 'Span';
  const styles = new Map();
  styles.set(style.name, style);
  assert.equal(new StyleResolver(styles).hasStyle('Span'), true);
});

test('StyleResolver.hasStyle() returns false for an unknown style', () => {
    assert.equal(new StyleResolver().hasStyle('Span'), false);
});

test('StyleResolver.getStyle() returns an existing style', () => {
  const style = new Style();
  style.name = 'Span';
  const styles = new Map();
  styles.set(style.name, style);
  assert.equal(new StyleResolver(styles).getStyle('Span'), style);
});

test('StyleResolver.getStyle() returns null for an unknown style', () => {
  assert.equal(new StyleResolver().getStyle('Unknown'), null);
});

test('StyleResolver.getStyle() returns null for null', () => {
    assert.equal(new StyleResolver().getStyle(null), null);
});

test('StyleResolver.getTextStyle() returns a text style', () => {
  const style = new Style();
  style.name   = 'Span';
  style.family = 'text';
  const styles = new Map();
  styles.set(style.name, style);
  assert.equal(new StyleResolver(styles).getTextStyle('Span'), style);
});

test('StyleResolver.getTextStyle() returns null for a non-text style', () => {
  const style = new Style();
  style.name   = 'Paragraph';
  style.family = 'paragraph';
  const styles = new Map();
  styles.set(style.name, style);
  assert.equal(new StyleResolver(styles).getTextStyle('Paragraph'), null);
});

test('StyleResolver.getParagraphStyle() returns a paragraph style', () => {
  const style = new Style();
  style.name   = 'Paragraph';
  style.family = 'paragraph';
  const styles = new Map();
  styles.set(style.name, style);
  assert.equal(new StyleResolver(styles).getParagraphStyle('Paragraph'), style);
});

test('StyleResolver.getCellStyle() returns a table cell style', () => {
  const style = new Style();
  style.name   = 'Cell';
  style.family = 'table-cell';
  const styles = new Map();
  styles.set(style.name, style);
  assert.equal(new StyleResolver(styles).getCellStyle('Cell'), style);
});

test('StyleResolver.getRowStyle() returns a table row style', () => {
  const style = new Style();
  style.name   = 'Row';
  style.family = 'table-row';
  const styles = new Map();
  styles.set(style.name, style);
  assert.equal(new StyleResolver(styles).getRowStyle('Row'), style);
});

test('StyleResolver.getColumnStyle() returns a table column style', () => {
  const style = new Style();
  style.name   = 'Column';
  style.family = 'table-column';
  const styles = new Map();
  styles.set(style.name, style);
  assert.equal(new StyleResolver(styles).getColumnStyle('Column'), style);
});

test('StyleResolver family methods return null for unknown styles', () => {
  const resolver = new StyleResolver();
  assert.equal(resolver.getTextStyle('Unknown'), null);
  assert.equal(resolver.getParagraphStyle('Unknown'), null);
  assert.equal(resolver.getCellStyle('Unknown'), null);
  assert.equal(resolver.getRowStyle('Unknown'), null);
  assert.equal(resolver.getColumnStyle('Unknown'), null);
});
