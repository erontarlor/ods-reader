import test from 'node:test';
import assert from 'node:assert/strict';
import Style from '../../src/Style.js';

test('Style constructor initializes default values', () => {
  const style = new Style();
  assert.deepEqual(style.appliedStyleNames,  []);
  assert.equal    (style.resolved,           false);
  assert.equal    (style.automatic,          false);
  assert.equal    (style.isDefault,          false);
  assert.equal    (style.family,             null);
  assert.equal    (style.parent,             null);
  assert.equal    (style.name,               null);
  assert.equal    (style.fontFamily,         null);
  assert.equal    (style.fontSize,           null);
  assert.equal    (style.fontWeight,         null);
  assert.equal    (style.fontStyle,          null);
  assert.equal    (style.fontVariant,        null);
  assert.equal    (style.fontStretch,        null);
  assert.equal    (style.fontFamilyGeneric,  null);
  assert.equal    (style.fontPitch,          null);
  assert.equal    (style.underlineStyle,     null);
  assert.equal    (style.underlineType,      null);
  assert.equal    (style.underlineWidth,     null);
  assert.equal    (style.underlineColor,     null);
  assert.equal    (style.overlineStyle,      null);
  assert.equal    (style.overlineType,       null);
  assert.equal    (style.overlineWidth,      null);
  assert.equal    (style.overlineColor,      null);
  assert.equal    (style.strikeThroughStyle, null);
  assert.equal    (style.strikeThroughType,  null);
  assert.equal    (style.strikeThroughWidth, null);
  assert.equal    (style.strikeThroughText,  null);
  assert.equal    (style.outline,            null);
  assert.equal    (style.textPosition,       null);
  assert.equal    (style.textColor,          null);
  assert.equal    (style.backgroundColor,    null);
  assert.equal    (style.useWindowFontColor, null);
  assert.equal    (style.language,           null);
  assert.equal    (style.country,            null);
  assert.equal    (style.languageAsian,      null);
  assert.equal    (style.countryAsian,       null);
  assert.equal    (style.languageComplex,    null);
  assert.equal    (style.countryComplex,     null);
  assert.equal    (style.horizontalAlign,    null);
  assert.equal    (style.marginLeft,         null);
  assert.equal    (style.marginRight,        null);
  assert.equal    (style.marginTop,          null);
  assert.equal    (style.marginBottom,       null);
  assert.equal    (style.textIndent,         null);
  assert.equal    (style.lineHeight,         null);
  assert.equal    (style.backgroundColor,    null);
  assert.equal    (style.verticalAlign,      null);
  assert.equal    (style.wrapText,           null);
  assert.equal    (style.rotation,           null);
  assert.equal    (style.border,             null);
  assert.equal    (style.borderTop,          null);
  assert.equal    (style.borderRight,        null);
  assert.equal    (style.borderBottom,       null);
  assert.equal    (style.borderLeft,         null);
  assert.equal    (style.hyperlink,          null);
  assert.equal    (style.hyperlinkFrame,     null);
});

test('Style.hasProperty() returns true if property is set', () => {
  const style = new Style();
  style.fontWeight = 'bold';
  assert.equal(style.hasProperty('fontWeight'), true);
});

test('Style.hasProperty() returns false if property is not set', () => {
  const style = new Style();
  style.fontWeight = null;
  assert.equal(style.hasProperty('fontWeight'), false);
});

test('Style.clone() creates a deep copy', () => {
  const style = new Style();
  style.fontWeight = 'bold';
  style.fontFamily = 'Arial';
  const copy = style.clone();
  assert.notStrictEqual(copy,            style);
  assert.equal         (copy.fontWeight, 'bold');
  assert.equal         (copy.fontFamily, 'Arial');
});

test('Style.clone() resets resolved flag', () => {
  const style = new Style();
  style.resolved = true;
  const copy = style.clone();
  assert.equal(copy.resolved, false);
});

test('Style.clone() returns an independent copy', () => {
  const style = new Style();
  style.appliedStyleNames = [{family: 'text', name: 'style1'}];
  style.fontWeight        = 'bold';
  const copy = style.clone();
  copy.appliedStyleNames.push({family: 'paragraph', name: 'style2'});
  copy.fontWeight = 'normal';
  assert.deepEqual(style.appliedStyleNames, [{family: 'text', name: 'style1'}]);
  assert.equal    (style.fontWeight,        'bold');
  assert.deepEqual(copy.appliedStyleNames,  [{family: 'text', name: 'style1'}, {family: 'paragraph', name: 'style2'}]);
  assert.equal    (copy.fontWeight,         'normal');
});

test('Style.merge() does nothing if parent it style itself', () => {
  const style = new Style();
  style.merge(style);
  assert.deepEqual(style.appliedStyleNames,  []);
  assert.equal    (style.resolved,           false);
  assert.equal    (style.automatic,          false);
  assert.equal    (style.isDefault,          false);
  assert.equal    (style.family,             null);
  assert.equal    (style.parent,             null);
  assert.equal    (style.name,               null);
  assert.equal    (style.fontFamily,         null);
  assert.equal    (style.fontSize,           null);
  assert.equal    (style.fontWeight,         null);
  assert.equal    (style.fontStyle,          null);
  assert.equal    (style.fontVariant,        null);
  assert.equal    (style.fontStretch,        null);
  assert.equal    (style.fontFamilyGeneric,  null);
  assert.equal    (style.fontPitch,          null);
  assert.equal    (style.underlineStyle,     null);
  assert.equal    (style.underlineType,      null);
  assert.equal    (style.underlineWidth,     null);
  assert.equal    (style.underlineColor,     null);
  assert.equal    (style.overlineStyle,      null);
  assert.equal    (style.overlineType,       null);
  assert.equal    (style.overlineWidth,      null);
  assert.equal    (style.overlineColor,      null);
  assert.equal    (style.strikeThroughStyle, null);
  assert.equal    (style.strikeThroughType,  null);
  assert.equal    (style.strikeThroughWidth, null);
  assert.equal    (style.strikeThroughText,  null);
  assert.equal    (style.outline,            null);
  assert.equal    (style.textPosition,       null);
  assert.equal    (style.textColor,          null);
  assert.equal    (style.backgroundColor,    null);
  assert.equal    (style.useWindowFontColor, null);
  assert.equal    (style.language,           null);
  assert.equal    (style.country,            null);
  assert.equal    (style.languageAsian,      null);
  assert.equal    (style.countryAsian,       null);
  assert.equal    (style.languageComplex,    null);
  assert.equal    (style.countryComplex,     null);
  assert.equal    (style.horizontalAlign,    null);
  assert.equal    (style.marginLeft,         null);
  assert.equal    (style.marginRight,        null);
  assert.equal    (style.marginTop,          null);
  assert.equal    (style.marginBottom,       null);
  assert.equal    (style.textIndent,         null);
  assert.equal    (style.lineHeight,         null);
  assert.equal    (style.backgroundColor,    null);
  assert.equal    (style.verticalAlign,      null);
  assert.equal    (style.wrapText,           null);
  assert.equal    (style.rotation,           null);
  assert.equal    (style.border,             null);
  assert.equal    (style.borderTop,          null);
  assert.equal    (style.borderRight,        null);
  assert.equal    (style.borderBottom,       null);
  assert.equal    (style.borderLeft,         null);
  assert.equal    (style.hyperlink,          null);
  assert.equal    (style.hyperlinkFrame,     null);
});

test('Style.merge() throws an error parent is not a Style', () => {
  const style = new Style();
  assert.throws(() => style.merge(null), {name: 'TypeError', message: 'parentStyle must be a Style.'});
});

test('Style.merge() throws an error if family does not match', () => {
  const parent = new Style();
  parent.family = 'parentFamily';
  parent.name   = 'parentName';
  const child = new Style();
  child.family = 'childFamily';
  child.name   = 'childName';
  assert.throws(() => child.merge(parent), {name: 'Error', message: 'Cannot merge style "childName" (childFamily) with "parentName" (parentFamily).'});
});

test('Style.merge() ignores null values', () => {
  const parent = new Style();
  parent.fontWeight = null;
  const child = new Style();
  child.fontWeight = 'bold';
  child.merge(parent);
  assert.equal(child.fontWeight, 'bold');
});

test('Style.merge() ignores special properties', () => {
  const parent = new Style();
  parent.appliedStyleNames = [{family: 'text', name: 'style'}];
  parent.resolved          = true;
  parent.automatic         = true;
  parent.isDefault         = true;
  parent.family            = 'test';
  parent.parent            = 'test';
  parent.name              = 'test';
  const child = new Style();
  child.merge(parent);
  assert.deepEqual(child.appliedStyleNames, []);
  assert.equal    (child.resolved,          false);
  assert.equal    (child.automatic,         false);
  assert.equal    (child.isDefault,         false);
  assert.equal    (child.family,            null);
  assert.equal    (child.parent,            null);
  assert.equal    (child.name,              null);
});

test('Style.merge() copies missing properties only', () => {
  const parent = new Style();
  parent.fontWeight = 'bold';
  parent.fontStyle  = 'italic';
  const child = new Style();
  child.fontWeight = 'normal';
  child.merge(parent);
  assert.equal(child.fontWeight, 'normal');
  assert.equal(child.fontStyle,  'italic');
});

test('Style.equals() returns true if both styles are equal', () => {
  const style1 = new Style();
  style1.fontWeight = 'bold';
  style1.fontStyle  = 'italic';
  const style2 = new Style();
  style2.fontWeight = 'bold';
  style2.fontStyle  = 'italic';
  assert.equal(style1.equals(style2), true);
});

test('Style.equals() returns false if styles differ in at least one property', () => {
  const style1 = new Style();
  style1.fontWeight = 'bold';
  style1.fontStyle  = 'italic';
  const style2 = new Style();
  style2.fontWeight = 'bold';
  style2.fontStyle  = 'normal';
  assert.equal(style1.equals(style2), false);
});

test('Style.equals() ignores special properties', () => {
  const style1 = new Style();
  style1.fontWeight        = 'bold';
  style1.fontStyle         = 'italic';
  style1.appliedStyleNames = [{family: 'text', name: 'style'}];
  style1.resolved          = true;
  style1.automatic         = true;
  style1.isDefault         = true;
  style1.family            = 'test';
  style1.parent            = 'test';
  style1.name              = 'test';
  const style2 = new Style();
  style2.fontWeight = 'bold';
  style2.fontStyle  = 'italic';
  assert.equal(style1.equals(style2), true);
});
