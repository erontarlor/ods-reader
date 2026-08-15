/**
 * General data object for storing style information.
 */
export default class Style {

  static managementProperties = ['appliedStyleNames', 'resolved', 'automatic', 'isDefault', 'family', 'parent', 'name'];

  constructor() {
    this.appliedStyleNames  = [];
    this.resolved           = false;
    this.automatic          = false;
    this.isDefault          = false;
    this.family             = null;
    this.parent             = null;
    this.name               = null;
    this.fontFamily         = null;
    this.fontSize           = null;
    this.fontWeight         = null;
    this.fontStyle          = null;
    this.fontVariant        = null;
    this.fontStretch        = null;
    this.fontFamilyGeneric  = null;
    this.fontPitch          = null;
    this.underlineStyle     = null;
    this.underlineType      = null;
    this.underlineWidth     = null;
    this.underlineColor     = null;
    this.overlineStyle      = null;
    this.overlineType       = null;
    this.overlineWidth      = null;
    this.overlineColor      = null;
    this.strikeThroughStyle = null;
    this.strikeThroughType  = null;
    this.strikeThroughWidth = null;
    this.strikeThroughText  = null;
    this.outline            = null;
    this.textPosition       = null;
    this.textColor          = null;
    this.backgroundColor    = null;
    this.useWindowFontColor = null;
    this.language           = null;
    this.country            = null;
    this.languageAsian      = null;
    this.countryAsian       = null;
    this.languageComplex    = null;
    this.countryComplex     = null;
    this.horizontalAlign    = null;
    this.marginLeft         = null;
    this.marginRight        = null;
    this.marginTop          = null;
    this.marginBottom       = null;
    this.textIndent         = null;
    this.lineHeight         = null;
    this.backgroundColor    = null;
    this.verticalAlign      = null;
    this.wrapText           = null;
    this.rotation           = null;
    this.border             = null;
    this.borderTop          = null;
    this.borderRight        = null;
    this.borderBottom       = null;
    this.borderLeft         = null;
    this.hyperlink          = null;
    this.hyperlinkFrame     = null;
  }

  /**
   * Returns whether ths style has the specified property set.
   *
   * @param   {string}  property The property name to check.
   * @returns {boolean}          true if it is set, false otherwise.
   */
  hasProperty(property) {
    return this[property] !== null;
  }

  /**
   * Creates a copy of this style.
   *
   * @returns {Style} The created copy.
   */
  clone() {
    const copy = new Style();
    Object.assign(copy, this);
    copy.appliedStyleNames = [...this.appliedStyleNames];
    copy.resolved = false;
    return copy;
  }

  /**
   * Merges all missing properties from the given parent style.
   * Existing values of this style are preserved.
   *
   * @param   {Style} parentStyle Parent style.
   * @returns {Style}             This Style.
   */
  merge(parentStyle) {
    if(parentStyle === this) return this;
    if(!(parentStyle instanceof Style)) throw new TypeError('parentStyle must be a Style.');
    if(this.family && parentStyle.family && this.family !== parentStyle.family) throw new Error(`Cannot merge style "${this.name}" (${this.family}) with "${parentStyle.name}" (${parentStyle.family}).`);
    for(const [property, value] of Object.entries(parentStyle)) {
      if(value === null || this.hasProperty(property) || Style.managementProperties.includes(property)) continue;
      this[property] = value;
    }
    return this;
  }

  /**
   * Checks whether two styles are equal.
   *
   * @param   {Style}   style The style to compare with.
   * @returns {boolean}       true if styles are equal, false otherwise.
   */
  equals(style) {
    for(const [property, value] of Object.entries(style)) {
      if(!Style.managementProperties.includes(property) && this[property] !== value) return false;
    }
    return true;
  }

}
