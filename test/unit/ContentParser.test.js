import test from 'node:test';
import assert from 'node:assert/strict';
import {MockCellBuilder, readTestFile, createStyleResolver, createStyle, assertBuilderContents} from '../TestUtils.js';
import ContentParser from '../../src/ContentParser.js';

function parseTestFile(fileName, resolver = createStyleResolver()) {
  const builder = new MockCellBuilder();
  new ContentParser(resolver, builder).parse(readTestFile(fileName));
  return builder;
}

test('ContentParser.parse() parses an invalid styles document', () => {
  assert.throws(() => parseTestFile('invalid-document.xml'), {name: 'Error', message: 'Invalid attribute name\nLine: 8\nColumn: 1\nChar: <'});
});

test('ContentParser.parse() parses empty content', () => {
  const builder = parseTestFile('empty-content.xml');
  assertBuilderContents(builder, 0, []);
});

test('ContentParser.parse() parses a single cell', () => {
  const builder = parseTestFile('single-cell.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: []}]);
});

test('ContentParser.parse() parses multiple cells', () => {
  const builder = parseTestFile('multiple-cells.xml');
  assertBuilderContents(builder, 1, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 0, column: 1, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 0, column: 2, covered: false, richText: []}
  ]);
});

test('ContentParser.parse() expands repeated columns', () => {
  const builder = parseTestFile('repeated-columns.xml');
  assertBuilderContents(builder, 1, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 0, column: 1, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 0, column: 2, covered: false, richText: []}
  ]);
});

test('ContentParser.parse() expands repeated columns with default value', () => {
  const builder = parseTestFile('repeated-columns-default.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: []}]);
});

test('ContentParser.parse() expands spanned columns', () => {
  const builder = parseTestFile('spanned-columns.xml');
  assertBuilderContents(builder, 1, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 0, column: 1, covered: true,  richText: []},
    {sheetName: 'Sheet1', row: 0, column: 2, covered: true,  richText: []}
  ]);
});

test('ContentParser.parse() expands spanned columns with default value', () => {
  const builder = parseTestFile('spanned-columns-default.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: []}]);
});

test('ContentParser.parse() parses multiple rows', () => {
  const builder = parseTestFile('multiple-rows.xml');
  assertBuilderContents(builder, 1, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 1, column: 0, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 2, column: 0, covered: false, richText: []}
  ]);
});

test('ContentParser.parse() expands repeated rows', () => {
  const builder = parseTestFile('repeated-rows.xml');
  assertBuilderContents(builder, 1, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 1, column: 0, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 2, column: 0, covered: false, richText: []}
  ]);
});

test('ContentParser.parse() expands repeated rows with default', () => {
  const builder = parseTestFile('repeated-rows-default.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: []}]);
});

test('ContentParser.parse() expands spanned rows', () => {
  const builder = parseTestFile('spanned-rows.xml');
  assertBuilderContents(builder, 1, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 1, column: 0, covered: true,  richText: []},
    {sheetName: 'Sheet1', row: 2, column: 0, covered: true,  richText: []}
  ]);
});

test('ContentParser.parse() expands spanned rows with default', () => {
  const builder = parseTestFile('spanned-rows-default.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: []}]);
});

test('ContentParser.parse() parses multiple sheets', () => {
  const builder = parseTestFile('multiple-sheets.xml');
  assertBuilderContents(builder, 2, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: []},
    {sheetName: 'Sheet2', row: 0, column: 0, covered: false, richText: []}
  ]);
});

test('ContentParser.parse() parses unnamed sheets', () => {
  const builder = parseTestFile('unnamed-sheet.xml');
  assertBuilderContents(builder, 1, [{sheetName: null, row: 0, column: 0, covered: false, richText: []}]);
});

test('ContentParser.parse() parses a single paragraph', () => {
  const builder = parseTestFile('single-paragraph.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello World', style: {}}]}]);
});

test('ContentParser.parse() parses multiple paragraphs', () => {
  const builder = parseTestFile('multiple-paragraphs.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello\nWorld', style: {}}]}]);
});

test('ContentParser.parse() parses empty cells in between filled cells', () => {
  const builder = parseTestFile('empty-cell.xml');
  assertBuilderContents(builder, 1, [
    {sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello', style: {}}]},
    {sheetName: 'Sheet1', row: 0, column: 1, covered: false, richText: []},
    {sheetName: 'Sheet1', row: 0, column: 2, covered: false, richText: [{text: 'World', style: {}}]}
  ]);
});

test('ContentParser.parse() parses a single span within text', () => {
  const builder = parseTestFile('single-span.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello World!', style: {}}]}]);
});

test('ContentParser.parse() parses multiple spans within text', () => {
  const builder = parseTestFile('multiple-spans.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello World!', style: {}}]}]);
});

test('ContentParser.parse() parses nested spans', () => {
  const builder = parseTestFile('nested-spans.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello World!', style: {}}]}]);
});

test('ContentParser.parse() parses an empty hyperlink within text', () => {
  const builder = parseTestFile('empty-hyperlink.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [
    {text: 'Hello World!', style: {appliedStyleNames: [], hyperlink: null, hyperlinkFrame: null}}
  ]}]);
});

test('ContentParser.parse() parses a single hyperlink within text', () => {
  const builder = parseTestFile('single-hyperlink.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [
    {text: 'Hello ', style: {appliedStyleNames: [], hyperlink: null,                       hyperlinkFrame: null}},
    {text: 'World',  style: {appliedStyleNames: [], hyperlink: 'https://www.example.com/', hyperlinkFrame: 'Hello World'}},
    {text: '!',      style: {appliedStyleNames: [], hyperlink: null,                       hyperlinkFrame: null}}
  ]}]);
});

test('ContentParser.parse() parses a single hyperlink with span', () => {
  const builder = parseTestFile('span-hyperlink.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [
    {text: 'Hello World', style: {appliedStyleNames: [], hyperlink: 'https://www.example.com/', hyperlinkFrame: 'Hello World'}}
  ]}]);
});

test('ContentParser.parse() parses single space character', () => {
  const builder = parseTestFile('single-space.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello World', style: {}}]}]);
});

test('ContentParser.parse() parses multiple space characters', () => {
  const builder = parseTestFile('multiple-spaces.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello   World', style: {}}]}]);
});

test('ContentParser.parse() parses single tabulator character', () => {
  const builder = parseTestFile('single-tab.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello\tWorld', style: {}}]}]);
});

test('ContentParser.parse() parses multiple tabulator characters', () => {
  const builder = parseTestFile('multiple-tabs.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello\t\t\tWorld', style: {}}]}]);
});

test('ContentParser.parse() parses single line break character', () => {
  const builder = parseTestFile('single-line-break.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello\nWorld', style: {}}]}]);
});

test('ContentParser.parse() parses multiple line break characters', () => {
  const builder = parseTestFile('multiple-line-breaks.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello\n\n\nWorld', style: {}}]}]);
});

test('ContentParser.parse() ignores unknown styles', () => {
  const builder = parseTestFile('styled-cells.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello', style: {appliedStyleNames: []}}]}]);
});

test('ContentParser.parse() parses styled cells', () => {
  const builder = parseTestFile('styled-cells.xml', createStyleResolver(createStyle('Cell', 'table-cell', null, 'middle', null)));
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [
    {text: 'Hello', style: {appliedStyleNames: [{family: 'table-cell', name: 'Cell'}], verticalAlign: 'middle'}}
  ]}]);
});

test('ContentParser.parse() parses styled paragraphs', () => {
  const builder = parseTestFile('styled-paragraphs.xml', createStyleResolver(createStyle('Paragraph', 'paragraph', 'middle', null, null)));
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [
    {text: 'Hello', style: {appliedStyleNames: [{family: 'paragraph', name: 'Paragraph'}], horizontalAlign: 'middle'}}
  ]}]);
});

test('ContentParser.parse() parses multiple styled paragraphs', () => {
  const builder = parseTestFile('styled-multiple-paragraphs.xml', createStyleResolver(createStyle('Paragraph', 'paragraph', 'middle', null, null)));
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [
    {text: 'Hello\n', style: {appliedStyleNames: [{family: 'paragraph', name: 'Paragraph'}], horizontalAlign: 'middle'}},
    {text: 'World',   style: {appliedStyleNames: [],                                         horizontalAlign: null}}
  ]}]);
});

test('ContentParser.parse() parses styled spans', () => {
  const builder = parseTestFile('styled-spans.xml', createStyleResolver(createStyle('Span', 'text', null, null, 'bold')));
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [
    {text: 'Hello ', style: {appliedStyleNames: [],                               fontWeight: null}},
    {text: 'World',  style: {appliedStyleNames: [{family: 'text', name: 'Span'}], fontWeight: 'bold'}},
    {text: '!',      style: {appliedStyleNames: [],                               fontWeight: null}}
  ]}]);
});

test('ContentParser.parse() parses styled paragraphs with styled spans', () => {
  const builder = parseTestFile('styled-paragraphs-spans.xml', createStyleResolver(createStyle('Paragraph', 'paragraph', 'middle', null, null), createStyle('Span', 'text', null, null, 'bold')));
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [
    {text: 'Hello ', style: {appliedStyleNames: [{family: 'paragraph', name: 'Paragraph'}],                                 horizontalAlign: 'middle', fontWeight: null}},
    {text: 'World',  style: {appliedStyleNames: [{family: 'paragraph', name: 'Paragraph'}, {family: 'text', name: 'Span'}], horizontalAlign: 'middle', fontWeight: 'bold'}}
  ]}]);
});

test('ContentParser.parse() parses styled cells with styled paragraphs and styled spans', () => {
  const builder = parseTestFile('styled-cells-paragraphs-spans.xml', createStyleResolver(createStyle('Cell', 'table-cell', null, 'middle', null), createStyle('Paragraph', 'paragraph', 'middle', null, null), createStyle('Span', 'text', null, null, 'bold')));
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [
    {text: 'Hello ', style: {appliedStyleNames: [{family: 'table-cell', name: 'Cell'}, {family: 'paragraph', name: 'Paragraph'}],                                 verticalAlign: 'middle', horizontalAlign: 'middle', fontWeight: null}},
    {text: 'World',  style: {appliedStyleNames: [{family: 'table-cell', name: 'Cell'}, {family: 'paragraph', name: 'Paragraph'}, {family: 'text', name: 'Span'}], verticalAlign: 'middle', horizontalAlign: 'middle', fontWeight: 'bold'}}
  ]}]);
});

test('ContentParser.parse() parses styled spaces', () => {
  const builder = parseTestFile('styled-spaces.xml', createStyleResolver(createStyle('Span', 'text', null, null, 'bold')));
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [
    {text: 'Hello ',   style: {appliedStyleNames: []}},
    {text: '  World', style: {appliedStyleNames: [{family: 'text', name: 'Span'}], fontWeight: 'bold'}}
  ]}]);
});

test('ContentParser.parse() parses a single hyperlink with styled span', () => {
  const builder = parseTestFile('styled-span-hyperlink.xml', createStyleResolver(createStyle('Span', 'text', null, null, 'bold')));
  assert.equal(builder.cells.length, 1);
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [
    {text: 'Hello ', style: {appliedStyleNames: [],                               fontWeight: null,   hyperlink: 'https://www.example.com/', hyperlinkFrame: 'Hello World'}},
    {text: 'World',  style: {appliedStyleNames: [{family: 'text', name: 'Span'}], fontWeight: 'bold', hyperlink: 'https://www.example.com/', hyperlinkFrame: 'Hello World'}}
  ]}]);
});

test('ContentParser.parse() parses a bookmark', () => {
  const builder = parseTestFile('bookmark.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello World', style: {}}]}]);
});

test('ContentParser.parse() parses a bookmark with start and end', () => {
  const builder = parseTestFile('bookmark-start-end.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello World', style: {}}]}]);
});

test('ContentParser.parse() parses an annotation', () => {
  const builder = parseTestFile('annotation.xml');
  assertBuilderContents(builder, 1, [{sheetName: 'Sheet1', row: 0, column: 0, covered: false, richText: [{text: 'Hello World', style: {}}]}]);
});
