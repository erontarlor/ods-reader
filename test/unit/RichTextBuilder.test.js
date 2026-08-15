import test from 'node:test';
import assert from 'node:assert/strict';
import {assertStylesAt} from '../TestUtils.js';
import RichTextBuilder from '../../src/RichTextBuilder.js';
import Style from '../../src/Style.js';

test('RichTextBuilder constructor creates an empty builder', () => {
  const {plainText, richText, styleAt} = new RichTextBuilder().build();
  assert.equal    (plainText, '');
  assert.deepEqual(richText,  []);
  assert.deepEqual(styleAt,   []);
});

test('RichTextBuilder.clear() removes all segments', () => {
  const {plainText, richText, styleAt} = new RichTextBuilder().append('Hello', new Style()).clear().build();
  assert.equal    (plainText, '');
  assert.deepEqual(richText,  []);
  assert.deepEqual(styleAt,   []);
});

test('RichTextBuilder.append() adds a text segment', () => {
  const {plainText, richText, styleAt} = new RichTextBuilder().append('Hello', new Style()).build();
  assert.equal(plainText,        'Hello');
  assert.equal(richText.length,  1);
  assert.equal(richText[0].text, 'Hello');
  assert.ok   (richText[0].style instanceof Style);
  assert.equal(styleAt.length,   5);
  assertStylesAt(styleAt, 0, 4, richText[0].style);
});

test('RichTextBuilder.append() ignores empty strings', () => {
  const {plainText, richText, styleAt} = new RichTextBuilder().append('', new Style()).build();
  assert.equal    (plainText, '');
  assert.deepEqual(richText,  []);
  assert.deepEqual(styleAt,   []);
});

test('RichTextBuilder.append() ignores null', () => {
  const {plainText, richText, styleAt} = new RichTextBuilder().append(null, new Style()).build();
  assert.equal    (plainText, '');
  assert.deepEqual(richText,  []);
  assert.deepEqual(styleAt,   []);
});

test('RichTextBuilder.append() stores a clone of the style', () => {
  const style = new Style();
  style.fontWeight = 'bold';
  const builder = new RichTextBuilder().append('Hello', style);
  const content1 = builder.build();
  assert.equal(content1.richText[0].style.fontWeight, 'bold');
  assert.equal(content1.styleAt[0],                   content1.richText[0].style);
  style.fontWeight = 'normal';
  const content2 = builder.build();
  assert.equal(content2.richText[0].style.fontWeight, 'bold');
  assert.equal(content2.styleAt[0],                   content2.richText[0].style);
});

test('RichTextBuilder.append() stores null if no style is specified', () => {
  const {richText, styleAt} = new RichTextBuilder().append('Hello', null).build();
  assert.equal(richText[0].style, null);
  assert.equal(styleAt[0],        null);
});

test('RichTextBuilder.append() adds a line break to last segment if break is requested', () => {
  const style = new Style();
  style.fontWeight = 'bold';
  const {plainText, richText, styleAt} = new RichTextBuilder().append('Hello', style).breakSegment().append('World', style).build();
  assert.equal    (plainText,         'Hello\nWorld');
  assert.equal    (richText.length,   1);
  assert.equal    (richText[0].text,  'Hello\nWorld');
  assert.deepEqual(richText[0].style, style);
  assert.equal    (styleAt.length,    11);
  assertStylesAt(styleAt, 0, 10, richText[0].style);
});

test('RichTextBuilder.append() adds the text to the last segment if styles are equal', () => {
  const style = new Style();
  style.fontWeight = 'bold';
  const {plainText, richText, styleAt} = new RichTextBuilder().append('Hello', style).append(' World', style).build();
  assert.equal    (plainText,         'Hello World');
  assert.equal    (richText.length,   1);
  assert.equal    (richText[0].text,  'Hello World');
  assert.deepEqual(richText[0].style, style);
  assert.equal    (styleAt.length,    11);
  assertStylesAt(styleAt, 0, 10, richText[0].style);
});

test('RichTextBuilder.append() adds a new text segment if styles are not equal', () => {
  const style1 = new Style();
  style1.fontWeight = 'normal';
  const style2 = new Style();
  style2.fontWeight = 'bold';
  const {plainText, richText, styleAt} = new RichTextBuilder().append('Hello', style1).append(' World', style2).build();
  assert.equal    (plainText,         'Hello World');
  assert.equal    (richText.length,   2);
  assert.equal    (richText[0].text,  'Hello');
  assert.deepEqual(richText[0].style, style1);
  assert.equal    (richText[1].text,  ' World');
  assert.deepEqual(richText[1].style, style2);
  assert.equal    (styleAt.length,    11);
  assertStylesAt(styleAt, 0,  4, richText[0].style);
  assertStylesAt(styleAt, 5, 10, richText[1].style);
});

test('RichTextBuilder.append() adds unicode codepoints consisting of two UTF16 code units', () => {
  const {plainText, richText, styleAt} = new RichTextBuilder().append('😀', new Style()).build();
  assert.equal(plainText,        '😀');
  assert.equal(plainText.length, 2);
  assert.equal(richText.length,  1);
  assert.equal(richText[0].text, '😀');
  assert.ok   (richText[0].style instanceof Style);
  assert.equal(styleAt.length,   1);
  assertStylesAt(styleAt, 0, 0, richText[0].style);
});

test('RichTextBuilder.append() adds grapheme consisting of several unicode code points', () => {
  const {plainText, richText, styleAt} = new RichTextBuilder().append('👨‍👩‍👧‍👦', new Style()).build();
  assert.equal(plainText,        '👨‍👩‍👧‍👦');
  assert.equal(plainText.length, 11);
  assert.equal(richText.length,  1);
  assert.equal(richText[0].text, '👨‍👩‍👧‍👦');
  assert.ok   (richText[0].style instanceof Style);
  assert.equal(styleAt.length,   1);
  assertStylesAt(styleAt, 0, 0, richText[0].style);
});

test('RichTextBuilder.appendSpaces() adds a space character segment', () => {
  const {plainText, richText, styleAt} = new RichTextBuilder().appendSpaces(new Style()).build();
  assert.equal(plainText,        ' ');
  assert.equal(richText.length,  1);
  assert.equal(richText[0].text, ' ');
  assert.ok   (richText[0].style instanceof Style);
  assert.equal(styleAt.length,   1);
  assertStylesAt(styleAt, 0, 0, richText[0].style);
});

test('RichTextBuilder.appendSpaces() adds multiple space characters segment', () => {
  const {plainText, richText, styleAt} = new RichTextBuilder().appendSpaces(new Style(), 3).build();
  assert.equal(plainText,        '   ');
  assert.equal(richText.length,  1);
  assert.equal(richText[0].text, '   ');
  assert.ok   (richText[0].style instanceof Style);
  assert.equal(styleAt.length,   3);
  assertStylesAt(styleAt, 0, 2, richText[0].style);
});

test('RichTextBuilder.appendTab() adds a tabulator character segment', () => {
  const {plainText, richText, styleAt} = new RichTextBuilder().appendTabs(new Style()).build();
  assert.equal(plainText,        '\t');
  assert.equal(richText.length,  1);
  assert.equal(richText[0].text, '\t');
  assert.ok   (richText[0].style instanceof Style);
  assert.equal(styleAt.length,   1);
  assertStylesAt(styleAt, 0, 0, richText[0].style);
});

test('RichTextBuilder.appendTab() adds multiple tabulator characters segment', () => {
  const {plainText, richText, styleAt} = new RichTextBuilder().appendTabs(new Style(), 3).build();
  assert.equal(plainText,        '\t\t\t');
  assert.equal(richText.length,  1);
  assert.equal(richText[0].text, '\t\t\t');
  assert.ok   (richText[0].style instanceof Style);
  assert.equal(styleAt.length,   3);
  assertStylesAt(styleAt, 0, 2, richText[0].style);
});

test('RichTextBuilder.appendLineBreak() adds a line break character segment', () => {
  const {plainText, richText, styleAt} = new RichTextBuilder().appendLineBreaks(new Style()).build();
  assert.equal(plainText,        '\n');
  assert.equal(richText.length,  1);
  assert.equal(richText[0].text, '\n');
  assert.ok   (richText[0].style instanceof Style);
  assert.equal(styleAt.length,   1);
  assertStylesAt(styleAt, 0, 0, richText[0].style);
});

test('RichTextBuilder.appendLineBreak() adds multiple line break characters segment', () => {
  const {plainText, richText, styleAt} = new RichTextBuilder().appendLineBreaks(new Style(), 3).build();
  assert.equal(plainText,        '\n\n\n');
  assert.equal(richText.length,  1);
  assert.equal(richText[0].text, '\n\n\n');
  assert.ok   (richText[0].style instanceof Style);
  assert.equal(styleAt.length,   3);
  assertStylesAt(styleAt, 0, 2, richText[0].style);
});

test('RichTextBuilder.build() returns a copy of the segment array', () => {
  const builder = new RichTextBuilder().append('Hello', new Style());
  const content1 = builder.build();
  content1.richText.push({text: 'World', style: new Style()});
  const content2 = builder.build();
  assert.equal(content2.richText.length, 1);
});

test('RichTextBuilder.build() returns copies of the segments', () => {
  const builder = new RichTextBuilder().append('Hello', new Style());
  const content1 = builder.build();
  content1.richText[0].text = 'Modified';
  const content2 = builder.build();
  assert.equal(content2.richText[0].text, 'Hello');
});

test('RichTextBuilder.build() returns copies of the styles', () => {
  const style = new Style();
  style.fontWeight = 'bold';
  style.fontStyle  = 'italic';
  const builder = new RichTextBuilder().append('Hello', style);
  const content1 = builder.build();
  content1.richText[0].style.fontWeight = 'normal';
  content1.styleAt[0].fontStyle         = 'normal';
  const content2 = builder.build();
  assert.equal(content2.richText[0].style.fontWeight, 'bold');
  assert.equal(content2.styleAt[0].fontStyle,         'italic');
});
