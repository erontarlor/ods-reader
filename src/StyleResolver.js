/**
 * Resolves styles by their names.
 */
export default class StyleResolver {

  /**
   * @param {Map<string, Style>} styles Map containing all known styles.
   */
  constructor(styles = new Map()) {
    this.styles = styles;
  }

  /**
   * Returns whether a style exists.
   *
   * @param   {string|null} name Style name.
   * @returns {boolean}          true if style exists, false otherwise.
   */
  hasStyle(name) {
    return this.styles.has(name);
  }

  /**
   * Returns a style by its name.
   *
   * @param   {string|null} name Style name.
   * @returns {Style|null}       The style, or null if no such style exists.
   */
  getStyle(name) {
    if(!name) return null;
    return this.styles.get(name) ?? null;
  }

  /**
   * Returns a text style.
   *
   * @param   {string|null} name Style name.
   * @returns {Style|null}       The style, or null if no such style exists.
   */
  getTextStyle(name) {
    return this.#getStyleByFamily(name, 'text');
  }

  /**
   * Returns a paragraph style.
   *
   * @param   {string|null} name Style name.
   * @returns {Style|null}       The style, or null if no such style exists.
   */
  getParagraphStyle(name) {
    return this.#getStyleByFamily(name, 'paragraph');
  }

  /**
   * Returns a table cell style.
   *
   * @param   {string|null} name Style name.
   * @returns {Style|null}       The style, or null if no such style exists.
   */
  getCellStyle(name) {
    return this.#getStyleByFamily(name, 'table-cell');
  }

  /**
   * Returns a table row style.
   *
   * @param   {string|null} name Style name.
   * @returns {Style|null}       The style, or null if no such style exists.
   */
  getRowStyle(name) {
    return this.#getStyleByFamily(name, 'table-row');
  }

  /**
   * Returns a table column style.
   *
   * @param   {string|null} name Style name.
   * @returns {Style|null}       The style, or null if no such style exists.
   */
  getColumnStyle(name) {
    return this.#getStyleByFamily(name, 'table-column');
  }

  #getStyleByFamily(name, family) {
    const style = this.getStyle(name);
    if(!style || style.family !== family) return null;
    return style;
  }

}
