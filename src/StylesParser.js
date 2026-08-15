import sax from 'sax';
import Style from './Style.js';
import XmlContext from './XmlContext.js';

/**
 * Parses the styles.xml file of an ODS document.
 */
export default class StylesParser {

  constructor() {
    this.context       = new XmlContext();
    this.styles        = new Map();
    this.defaultStyles = new Map();
    this.currentStyle  = null;
  }

  /**
   * Parses an XML document string.
   *
   * @param   {string}       xml XML document string.
   * @returns {StylesParser}     This StylesParser.
   */
  parse(xml) {
    const parser = sax.parser(true, {xmlns: false, trim: false, normalize: false});
    parser.onopentag  = (node)  => {this.#onOpenTag(node);};
    parser.onclosetag = ()      => {this.#onCloseTag();};
    parser.onerror    = (error) => {throw error;};
    parser.write(xml).close();
    return this;
  }

  #onOpenTag(node) {
    this.context.push(node.name);
    if(this.context.isInside('office:styles', 'style:style'))                                                  return this.#startStyle(node, false);
    if(this.context.isInside('office:styles', 'style:style', 'style:text-properties'))                         return this.#parseTextProperties(node);
    if(this.context.isInside('office:styles', 'style:style', 'style:paragraph-properties'))                    return this.#parseParagraphProperties(node);
    if(this.context.isInside('office:styles', 'style:style', 'style:table-cell-properties'))                   return this.#parseTableCellProperties(node);
    if(this.context.isInside('office:styles', 'style:default-style'))                                          return this.#startDefaultStyle(node);
    if(this.context.isInside('office:styles', 'style:default-style', 'style:text-properties'))                 return this.#parseTextProperties(node);
    if(this.context.isInside('office:styles', 'style:default-style', 'style:paragraph-properties'))            return this.#parseParagraphProperties(node);
    if(this.context.isInside('office:styles', 'style:default-style', 'style:table-cell-properties'))           return this.#parseTableCellProperties(node);
    if(this.context.isInside('office:automatic-styles', 'style:style'))                                        return this.#startStyle(node, true);
    if(this.context.isInside('office:automatic-styles', 'style:style', 'style:text-properties'))               return this.#parseTextProperties(node);
    if(this.context.isInside('office:automatic-styles', 'style:style', 'style:paragraph-properties'))          return this.#parseParagraphProperties(node);
    if(this.context.isInside('office:automatic-styles', 'style:style', 'style:table-cell-properties'))         return this.#parseTableCellProperties(node);
    if(this.context.isInside('office:automatic-styles', 'style:default-style'))                                return this.#startDefaultStyle(node);
    if(this.context.isInside('office:automatic-styles', 'style:default-style', 'style:text-properties'))       return this.#parseTextProperties(node);
    if(this.context.isInside('office:automatic-styles', 'style:default-style', 'style:paragraph-properties'))  return this.#parseParagraphProperties(node);
    if(this.context.isInside('office:automatic-styles', 'style:default-style', 'style:table-cell-properties')) return this.#parseTableCellProperties(node);
  }

  #startStyle(node, automatic) {
    const attributes = node.attributes;
    this.currentStyle                     = new Style();
    this.currentStyle.name                = attributes['style:name'] ?? null;
    this.currentStyle.family              = attributes['style:family'] ?? null;
    this.currentStyle.parent              = attributes['style:parent-style-name'] ?? null;
    this.currentStyle.displayName         = attributes['style:display-name'] ?? null;
    this.currentStyle.textProperties      = {};
    this.currentStyle.paragraphProperties = {};
    this.currentStyle.tableCellProperties = {};
    this.currentStyle.graphicProperties   = {};
    this.currentStyle.automatic           = automatic;
    return this;
  }

  #startDefaultStyle(node) {
    const attributes = node.attributes;
    this.currentStyle           = new Style();
    this.currentStyle.family    = attributes['style:family'] ?? null;
    this.currentStyle.isDefault = true;
    return this;
  }

  #parseTextProperties(node) {
    const attributes = node.attributes;
    this.#parseFontProperties(attributes).#parseDecorationProperties(attributes).#parseColorProperties(attributes).#parseLanguageProperties(attributes);
    return this;
  }

  #parseFontProperties(attributes) {
    const style = this.currentStyle;
    if(attributes['fo:font-family'])            style.fontFamily        = attributes['fo:font-family'];
    if(attributes['fo:font-size'])              style.fontSize          = attributes['fo:font-size'];
    if(attributes['fo:font-weight'])            style.fontWeight        = attributes['fo:font-weight'];
    if(attributes['fo:font-style'])             style.fontStyle         = attributes['fo:font-style'];
    if(attributes['fo:font-variant'])           style.fontVariant       = attributes['fo:font-variant'];
    if(attributes['fo:font-stretch'])           style.fontStretch       = attributes['fo:font-stretch'];
    if(attributes['style:font-family-generic']) style.fontFamilyGeneric = attributes['style:font-family-generic'];
    if(attributes['style:font-pitch'])          style.fontPitch         = attributes['style:font-pitch'];
    return this;
  }

  #parseDecorationProperties(attributes) {
    const style = this.currentStyle;
    if(attributes['style:text-underline-style'])    style.underlineStyle     = attributes['style:text-underline-style'];
    if(attributes['style:text-underline-type'])     style.underlineType      = attributes['style:text-underline-type'];
    if(attributes['style:text-underline-width'])    style.underlineWidth     = attributes['style:text-underline-width'];
    if(attributes['style:text-underline-color'])    style.underlineColor     = attributes['style:text-underline-color'];
    if(attributes['style:text-overline-style'])     style.overlineStyle      = attributes['style:text-overline-style'];
    if(attributes['style:text-overline-type'])      style.overlineType       = attributes['style:text-overline-type'];
    if(attributes['style:text-overline-width'])     style.overlineWidth      = attributes['style:text-overline-width'];
    if(attributes['style:text-overline-color'])     style.overlineColor      = attributes['style:text-overline-color'];
    if(attributes['style:text-line-through-style']) style.strikeThroughStyle = attributes['style:text-line-through-style'];
    if(attributes['style:text-line-through-type'])  style.strikeThroughType  = attributes['style:text-line-through-type'];
    if(attributes['style:text-line-through-width']) style.strikeThroughWidth = attributes['style:text-line-through-width'];
    if(attributes['style:text-line-through-text'])  style.strikeThroughText  = attributes['style:text-line-through-text'];
    if(attributes['style:text-outline'])            style.outline            = attributes['style:text-outline'] === 'true';
    if(attributes['style:text-position'])           style.textPosition       = attributes['style:text-position'];
    return this;
  }

  #parseColorProperties(attributes) {
    const style = this.currentStyle;
    if(attributes['fo:color'])                    style.textColor          = attributes['fo:color'];
    if(attributes['fo:background-color'])         style.backgroundColor    = attributes['fo:background-color'];
    if(attributes['style:use-window-font-color']) style.useWindowFontColor = attributes['style:use-window-font-color'];
    return this;
  }

  #parseLanguageProperties(attributes) {
    const style = this.currentStyle;
    if(attributes['fo:language'])            style.language        = attributes['fo:language'];
    if(attributes['fo:country'])             style.country         = attributes['fo:country'];
    if(attributes['style:language-asian'])   style.languageAsian   = attributes['style:language-asian'];
    if(attributes['style:country-asian'])    style.countryAsian    = attributes['style:country-asian'];
    if(attributes['style:language-complex']) style.languageComplex = attributes['style:language-complex'];
    if(attributes['style:country-complex'])  style.countryComplex  = attributes['style:country-complex'];
    return this;
  }

  #parseParagraphProperties(node) {
    const attributes = node.attributes;
    const style      = this.currentStyle;
    if(attributes['fo:text-align'])    style.horizontalAlign = attributes['fo:text-align'];
    if(attributes['fo:margin-top'])    style.marginTop       = attributes['fo:margin-top'];
    if(attributes['fo:margin-right'])  style.marginRight     = attributes['fo:margin-right'];
    if(attributes['fo:margin-bottom']) style.marginBottom    = attributes['fo:margin-bottom'];
    if(attributes['fo:margin-left'])   style.marginLeft      = attributes['fo:margin-left'];
    if(attributes['fo:text-indent'])   style.textIndent      = attributes['fo:text-indent'];
    if(attributes['fo:line-height'])   style.lineHeight      = attributes['fo:line-height'];
    return this;
  }

  #parseTableCellProperties(node) {
    const attributes = node.attributes;
    const style      = this.currentStyle;
    if(attributes['fo:background-color'])  style.backgroundColor = attributes['fo:background-color'];
    if(attributes['style:vertical-align']) style.verticalAlign   = attributes['style:vertical-align'];
    if(attributes['fo:wrap-option'])       style.wrapText        = attributes['fo:wrap-option'];
    if(attributes['style:rotation-angle']) style.rotation        = Number.parseInt(attributes['style:rotation-angle'], 10);
    if(attributes['fo:border'])            style.border          = attributes['fo:border'];
    if(attributes['fo:border-top'])        style.borderTop       = attributes['fo:border-top'];
    if(attributes['fo:border-right'])      style.borderRight     = attributes['fo:border-right'];
    if(attributes['fo:border-bottom'])     style.borderBottom    = attributes['fo:border-bottom'];
    if(attributes['fo:border-left'])       style.borderLeft      = attributes['fo:border-left'];
    return this;
  }

  #onCloseTag() {
    if(this.context.isInside('office:styles', 'style:style'))                   this.#finishStyle();
    if(this.context.isInside('office:styles', 'style:default-style'))           this.#finishDefaultStyle();
    if(this.context.isInside('office:automatic-styles', 'style:style'))         this.#finishStyle();
    if(this.context.isInside('office:automatic-styles', 'style:default-style')) this.#finishDefaultStyle();
    this.context.pop();
    return this;
  }

  #finishStyle() {
    this.styles.set(this.currentStyle.name, this.currentStyle);
    this.currentStyle = null;
    return this;
  }

  #finishDefaultStyle() {
    this.defaultStyles.set(this.currentStyle.family, this.currentStyle);
    this.currentStyle = null;
    return this;
  }

  /**
   * Resolves all Style inheritances.
   *
   * @returns {StylesParser} This StylesParser.
   */
  resolveInheritance() {
    for(const style of this.styles.values()) {
      this.#resolveStyle(style, new Set());
    }
    return this;
  }

  #resolveStyle(style, visiting) {
    if(style.resolved) return this;
    if(visiting.has(style.name)) throw new Error(`Circular style inheritance detected for style "${style.name}".`);
    visiting.add(style.name);
    this.#resolveDefaultStyle(style).#resolveParentStyle(style, visiting);
    style.parent   = null;
    style.resolved = true;
    visiting.delete(style.name);
    return this;
  }

  #resolveDefaultStyle(style, visiting) {
    const defaultStyle = this.#getDefaultStyle(style);
    if(defaultStyle) style.merge(defaultStyle);
    return this;
  }

  #getDefaultStyle(style) {
    return this.defaultStyles.get(style.family) ?? null;
  }

  #resolveParentStyle(style, visiting) {
    if(!style.parent) return this;
    const parentStyle = this.#getParentStyle(style);
    if(!parentStyle) throw new Error(`Unknown parent style "${style.parent}" referenced by style "${style.name}".`);
    this.#resolveStyle(parentStyle, visiting);
    style.merge(parentStyle);
    return this;
  }

  #getParentStyle(style) {
    return this.styles.get(style.parent) ?? null;
  }

  /**
   * Returns all parsed styles.
   *
   * @returns {Map<string, Style>} Map of resolved styles indexed by style name.
   */
  getStyles() {
    return this.styles;
  }

  /**
   * Returns a style by its name.
   *
   * @param   {string}     name Style name.
   * @returns {Style|null}      The style, or null if no such style exists.
   */
  getStyle(name) {
    return this.styles.get(name) ?? null;
  }

}
