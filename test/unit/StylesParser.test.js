import test from 'node:test';
import assert from 'node:assert/strict';
import {readTestFile} from '../TestUtils.js';
import StylesParser from '../../src/StylesParser.js';

function parseTestFile(fileName) {
  return new StylesParser().parse(readTestFile(fileName)).resolveInheritance().getStyles();
}

test('StylesParser.parse() parses an invalid styles document', () => {
  assert.throws(() => parseTestFile('invalid-document.xml'), {name: 'Error', message: 'Invalid attribute name\nLine: 8\nColumn: 1\nChar: <'});
});

test('StylesParser.parse() parses an empty styles document', () => {
  const styles = parseTestFile('empty-document.xml');
  assert.equal(styles.size, 0);
});

test('StylesParser.parse() parses a simple style', () => {
  const styles = parseTestFile('simple-style.xml');
  assert.equal(styles.size, 1);
  const style = styles.get('Span');
  assert.ok   (style);
  assert.equal(style.name,        'Span');
  assert.equal(style.family,      'text');
  assert.equal(style.displayName, 'DisplayBold');
  assert.equal(style.fontWeight,  'bold');
});

test('StylesParser.parse() parses an unnamed style', () => {
  const styles = parseTestFile('unnamed-style.xml');
  assert.equal(styles.size, 1);
});

test('StylesParser.parse() parses multiple styles', () => {
  const styles = parseTestFile('multiple-style.xml');
  assert.equal(styles.size, 3);
  assert.ok   (styles.has('Span1'));
  assert.ok   (styles.has('Span2'));
  assert.ok   (styles.has('Paragraph'));
});

test('StylesParser.parse() parses font properties', () => {
  const styles = parseTestFile('font-properties.xml');
  let style = styles.get('Font');
  assert.ok   (style);
  assert.equal(style.fontFamily,        'Arial');
  assert.equal(style.fontSize,          '12pt');
  assert.equal(style.fontWeight,        'bold');
  assert.equal(style.fontStyle,         'italic');
  assert.equal(style.fontVariant,       'variant');
  assert.equal(style.fontStretch,       'scretch');
  assert.equal(style.fontFamilyGeneric, 'generic');
  assert.equal(style.fontPitch,         'pitch');
});

test('StylesParser.parse() parses text decoration properties', () => {
  const styles = parseTestFile('decoration-properties.xml');
  const style = styles.get('Decoration');
  assert.ok   (style);
  assert.equal(style.underlineStyle,     'solid');
  assert.equal(style.underlineType,      'type1');
  assert.equal(style.underlineWidth,     '1');
  assert.equal(style.underlineColor,     '#ff0000');
  assert.equal(style.overlineStyle,      'solid');
  assert.equal(style.overlineType,       'type1');
  assert.equal(style.overlineWidth,      '2');
  assert.equal(style.overlineColor,      '#00ff00');
  assert.equal(style.strikeThroughStyle, 'solid');
  assert.equal(style.strikeThroughType,  'type1');
  assert.equal(style.strikeThroughWidth, '3');
  assert.equal(style.strikeThroughText,  'text');
  assert.equal(style.outline,            true);
  assert.equal(style.textPosition,       'position');
});

test('StylesParser.parse() parses color properties', () => {
  const styles = parseTestFile('color-properties.xml');
  const style = styles.get('Color');
  assert.ok   (style);
  assert.equal(style.textColor,          '#ff0000');
  assert.equal(style.backgroundColor,    '#ffff00');
  assert.equal(style.useWindowFontColor, '#00ffff');
});

test('StylesParser.parse() parses language properties', () => {
  const styles = parseTestFile('language-properties.xml');
  const style = styles.get('Language');
  assert.ok   (style);
  assert.equal(style.language,        'de');
  assert.equal(style.country,         'DE');
  assert.equal(style.languageAsian,   'A');
  assert.equal(style.countryAsian,    'B');
  assert.equal(style.languageComplex, 'C');
  assert.equal(style.countryComplex,  'D');
});

test('StylesParser.parse() parses paragraph properties', () => {
  const styles = parseTestFile('paragraph-properties.xml');
  const style = styles.get('Paragraph');
  assert.ok   (style);
  assert.equal(style.horizontalAlign, 'center');
  assert.equal(style.marginTop,       '1cm');
  assert.equal(style.marginRight,     '2cm');
  assert.equal(style.marginBottom,    '3cm');
  assert.equal(style.marginLeft,      '4cm');
  assert.equal(style.textIndent,      '5cm');
});

test('StylesParser.parse() parses table cell properties', () => {
  const styles = parseTestFile('table-cell-properties.xml');
  const style = styles.get('Cell');
  assert.ok   (style);
  assert.equal(style.verticalAlign, 'middle');
  assert.equal(style.wrapText,      'wrap');
  assert.equal(style.rotation,      90);
  assert.equal(style.border,        '0.75pt solid #000000');
  assert.equal(style.borderTop,     '1mm');
  assert.equal(style.borderRight,   '2mm');
  assert.equal(style.borderBottom,  '3mm');
  assert.equal(style.borderLeft,    '4mm');
});

test('StylesParser.parse() parses automatic styles', () => {
  const styles = parseTestFile('automatic-style.xml');
  const style = styles.get('ce1');
  assert.ok   (style);
  assert.equal(style.automatic,       true);
  assert.equal(style.fontWeight,      'bold');
  assert.equal(style.fontFamily,      'Invalid Font');
  assert.equal(style.fontSize,        '20pt');
  assert.equal(style.horizontalAlign, 'center');
  assert.equal(style.marginLeft,      '2cm');
  assert.equal(style.marginRight,     '2cm');
  assert.equal(style.lineHeight,      '120%');
  assert.equal(style.backgroundColor, '#eeeeee');
  assert.equal(style.verticalAlign,   'middle');
  assert.equal(style.wrapText,        'wrap');
  assert.equal(style.rotation,        90);
  assert.equal(style.border,          '0.75pt solid #000000');
});

test('StylesParser.resolveInheritance() resolves parent style inheritance', () => {
  const styles = parseTestFile('parent-style.xml');
  let style = styles.get('Paragraph1');
  assert.ok   (style);
  assert.equal(style.fontFamily, 'Liberation Sans');
  assert.equal(style.fontWeight, 'bold');
  style = styles.get('Paragraph2');
  assert.ok   (style);
  assert.equal(style.fontFamily, 'Liberation Sans');
  assert.equal(style.fontWeight, 'normal');
});

test('StylesParser.resolveInheritance() applies default style', () => {
  const styles = parseTestFile('default-style.xml');
  let style = styles.get('Normal');
  assert.ok   (style);
  assert.equal(style.fontSize,        '10pt');
  assert.equal(style.fontFamily,      'Liberation Sans');
  assert.equal(style.horizontalAlign, 'center');
  assert.equal(style.backgroundColor, '#eeeeee');
  style = styles.get('No Default');
  assert.ok   (style);
});

test('StylesParser.resolveInheritance() throws an error for unknown parent style', () => {
  assert.throws(() => parseTestFile('unknown-parent.xml'), {name: 'Error', message: 'Unknown parent style "DoesNotExist" referenced by style "Child".'});
});

test('StylesParser.resolveInheritance() throws an error for circular inheritance', () => {
  assert.throws(() => parseTestFile('circular-inheritance.xml'), {name: 'Error', message: 'Circular style inheritance detected for style "A".'});
});

test('StylesParser.getStyles() returns the parsed styles', () => {
  const styles = parseTestFile('multiple-style.xml');
  assert.equal(styles.size, 3);
  assert.ok   (styles.has('Span1'));
  assert.ok   (styles.has('Span2'));
  assert.ok   (styles.has('Paragraph'));
});

test('StylesParser.getStyle() returns the style with the specified name', () => {
  const style = new StylesParser().parse(readTestFile('multiple-style.xml')).getStyle('Span2');
  assert.ok   (style);
  assert.equal(style.name,      'Span2');
  assert.equal(style.family,    null);
  assert.equal(style.fontStyle, 'italic');
});

test('StylesParser.getStyle() returns null if style is not found', () => {
  const style = new StylesParser().parse(readTestFile('multiple-style.xml')).getStyle('NotExisting');
  assert.equal(style, null);
});
