import test from 'node:test';
import assert from 'node:assert/strict';
import XmlContext from '../../src/XmlContext.js';

test('XmlContext constructor creates an empty context', () => {
  const context = new XmlContext();
  assert.equal(context.depth(), 0);
  assert.equal(context.peek(),  null);
  assert.equal(context.path(),  '');
});

test('XmlContext.push() adds an element', () => {
  const context = new XmlContext();
  context.push('office:styles');
  assert.equal(context.depth(), 1);
  assert.equal(context.peek(),  'office:styles');
});

test('XmlContext.root() returns the first element', () => {
  const context = new XmlContext();
  context.push('office:styles');
  context.push('style:style');
  assert.equal(context.root(), 'office:styles');
});

test('XmlContext.root() returns null if context is empty', () => {
  const context = new XmlContext();
  assert.equal(context.root(), null);
});

test('XmlContext.pop() removes the last element', () => {
  const context = new XmlContext();
  context.push('office:styles');
  context.push('style:style');
  assert.equal(context.pop(), 'style:style');
  assert.equal(context.depth(), 1);
  assert.equal(context.peek(), 'office:styles');
});

test('XmlContext.pop() returns null if context is empty', () => {
  const context = new XmlContext();
  assert.equal(context.pop(), null);
});

test('XmlContext.peek() returns the current element', () => {
  const context = new XmlContext();
  context.push('office:styles');
  context.push('style:style');
  assert.equal(context.peek(), 'style:style');
});

test('XmlContext.peek() returns null if context is empty', () => {
  const context = new XmlContext();
  assert.equal(context.peek(), null);
});

test('XmlContext.parent() returns the parent element', () => {
  const context = new XmlContext();
  context.push('office:styles');
  context.push('style:style');
  assert.equal(context.parent(), 'office:styles');
});

test('XmlContext.parent() returns null if no parent exists', () => {
  const context = new XmlContext();
  context.push('office:styles');
  assert.equal(context.parent(), null);
});

test('XmlContext.path() returns the current XML path', () => {
  const context = new XmlContext();
  context.push('office:styles');
  context.push('style:style');
  context.push('style:text-properties');
  assert.equal(context.path(), 'office:styles/style:style/style:text-properties');
});

test('XmlContext.path() returns an empty string if context is empty', () => {
  const context = new XmlContext();
  assert.equal(context.path(), '');
});

test('XmlContext.contains() returns true if the corrent context contains the specified element', () => {
  const context = new XmlContext();
  context.push('office:styles');
  context.push('style:style');
  context.push('style:text-properties');
  assert.equal(context.contains('style:style'), true);
});

test('XmlContext.contains() returns false if the corrent context does not contain the specified element', () => {
  const context = new XmlContext();
  context.push('office:styles');
  context.push('style:style');
  context.push('style:text-properties');
  assert.equal(context.contains('style:wrong'), false);
});

test('XmlContext.isInside() returns true for the current path', () => {
  const context = new XmlContext();
  context.push('office:styles');
  context.push('style:style');
  context.push('style:text-properties');
  assert.equal(context.isInside('office:styles', 'style:style', 'style:text-properties'), true);
});

test('XmlContext.isInside() returns true if no path is specified', () => {
  const context = new XmlContext();
  context.push('office:styles');
  context.push('style:style');
  context.push('style:text-properties');
  assert.equal(context.isInside(), true);
});

test('XmlContext.isInside() returns false if specified path is longer the current context', () => {
  const context = new XmlContext();
  context.push('office:styles');
  context.push('style:style');
  assert.equal(context.isInside('office:styles', 'style:style', 'style:text-properties'), false);
});

test('XmlContext.isInside() returns false if specified path differs from current context', () => {
  const context = new XmlContext();
  context.push('office:styles');
  context.push('style:style');
  context.push('style:text-properties');
  assert.equal(context.isInside('office:styles', 'style:wrong', 'style:text-properties'), false);
});

test('XmlContext.isCurrent() returns true if current element matches the specified element', () => {
  const context = new XmlContext();
  context.push('office:styles');
  context.push('style:style');
  context.push('style:text-properties');
  assert.equal(context.isCurrent('style:text-properties'), true);
});

test('XmlContext.isCurrent() returns false if current element does not match the specified element', () => {
  const context = new XmlContext();
  context.push('office:styles');
  context.push('style:style');
  context.push('style:text-properties');
  assert.equal(context.isCurrent('style:wrong'), false);
});

test('XmlContext.depth() returns the nesting level', () => {
  const context = new XmlContext();
  context.push('a');
  context.push('b');
  context.push('c');
  assert.equal(context.depth(), 3);
});

test('XmlContext correctly tracks nested SAX events', () => {
  const context = new XmlContext();
  context.push('office:styles');
  assert.equal(context.isInside('office:styles'), true);
  context.push('style:style');
  assert.equal(context.isInside('office:styles', 'style:style'), true);
  context.push('style:text-properties');
  assert.equal(context.isInside('office:styles', 'style:style', 'style:text-properties'), true);
  context.pop();
  assert.equal(context.isInside('office:styles', 'style:style'), true);
  context.pop();
  assert.equal(context.isInside('office:styles'), true);
  context.pop();
  assert.equal(context.depth(), 0);
});
