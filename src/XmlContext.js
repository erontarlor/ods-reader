/**
 * Maintains the current XML element hierarchy while parsing an XML document.
 */
export default class XmlContext {

  constructor() {
    this.stack = [];
  }

  /**
   * Pushes an element onto the context stack.
   *
   * @param   {string}     name XML element name.
   * @returns {XmlContext}      This XmlContext.
   */
  push(name) {
    this.stack.push(name);
  }

  /**
   * Returns the first XML element.
   *
   * @returns {string|null} First element or null if the stack is empty.
   */
  root() {
    return this.stack.length > 0 ? this.stack[0] : null;
  }

  /**
   * Removes the current element from the context stack.
   *
   * @returns {string|null} Removed element or null if the stack is empty.
   */
  pop() {
    if(this.stack.length === 0) return null;
    return this.stack.pop();
  }

  /**
   * Returns the current XML element.
   *
   * @returns {string|null} Current element or null if the stack is empty.
   */
  peek() {
    if(this.stack.length === 0) return null;
    return this.stack[this.stack.length-1];
  }

  /**
   * Returns the parent element.
   *
   * @returns {string|null} Parent element or null if none exists.
   */
  parent() {
    if(this.stack.length < 2) return null;
    return this.stack[this.stack.length-2];
  }

  /**
   * Returns a string representation of the current XML path.
   *
   * @returns {string} The current XML path.
   */
  path() {
    return this.stack.join("/");
  }

  /**
   * Returns whether the specified element exists in the context stack.
   *
   * @param   {string}  name XML element name.
   * @returns {boolean}      true if the element exists, false otherwise.
   */
  contains(name) {
    return this.stack.includes(name);
  }

  /**
   * Returns whether the specified sequence of elements exists at the end
   * of the current XML path.
   *
   * @param   {...string} elements XML elements.
   * @returns {boolean}            true if the elements existi, false otherwise.
   */
  isInside(...elements) {
    if(elements.length === 0) return true;
    if(elements.length > this.stack.length) return false;
    const offset = this.stack.length-elements.length;
    for(let index = 0; index < elements.length; index++) {
      if(this.stack[offset+index] !== elements[index]) return false;
    }
    return true;
  }

  /**
   * Returns whether the current element matches the specified name.
   *
   * @param   {string}  name XML element name.
   * @returns {boolean}      true if current element matches, false otherwise.
   */
  isCurrent(name) {
    return this.peek() === name;
  }

  /**
   * Returns the current nesting depth.
   *
   * @returns {number} The depth.
   */
  depth() {
    return this.stack.length;
  }

}
