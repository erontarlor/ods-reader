/**
 * Builds the rich text representation of a table cell.
 */
export default class RichTextBuilder {

  constructor() {
    this.clear();
  }

  /**
   * Clears the current content.
   *
   * @returns {RichTextBuilder} This RichTextBuilder.
   */
  clear() {
    this.segments              = [];
    this.breakBeforeNextAppend = false;
    this.segmenter             = new Intl.Segmenter(undefined, {granularity: "grapheme"});
    return this;
  }

  /**
   * Prevents the next append() call from being merged with the previous segment.
   *
   * @returns {RichTextBuilder} This RichTextBuilder.
   */
  breakSegment() {
    this.breakBeforeNextAppend = true;
    return this;
  }

  /**
   * Appends a text segment.
   *
   * @param   {string}          text  Text to append.
   * @param   {Style}           style Style of the text.
   * @returns {RichTextBuilder}       This RichTextBuilder.
   */
  append(text, style) {
    if(!text) return this;
    if(style) style = style.clone();
    const last = this.segments.at(-1);
    if(last && this.breakBeforeNextAppend) this.#appendText(last, '\n');
    this.breakBeforeNextAppend = false;
    if(last && last.style.equals(style)) return this.#appendText(last, text);
    this.segments.push({text, style});
    return this;
  }

  #appendText(segment, text) {
    segment.text += text;
    return this;
  }

  /**
   * Appends one or more space characters.
   *
   * @param   {Style}           style Style of the text.
   * @param   {?number}         count Number of spaces.
   * @returns {RichTextBuilder}       This RichTextBuilder.
   */
  appendSpaces(style, count) {
    return this.#appendTextMultipleTimes(' ', style, count);
  }

  /**
   * Appends one or more tabulator characters.
   *
   * @param   {Style}           style Style of the text.
   * @param   {?number}         count Number of tabs.
   * @returns {RichTextBuilder}       This RichTextBuilder.
   */
  appendTabs(style, count) {
    return this.#appendTextMultipleTimes('\t', style, count);
  }

  /**
   * Appends one or more line break characters.
   *
   * @param   {Style}           style Style of the text.
   * @param   {?number}         count Number of line breaks.
   * @returns {RichTextBuilder}       This RichTextBuilder.
   */
  appendLineBreaks(style, count) {
    return this.#appendTextMultipleTimes('\n', style, count);
  }

  #appendTextMultipleTimes(text, style, count = 1) {
    return this.append(text.repeat(count), style);
  }

  /**
   * Builds the final rich text data structures for the builder's current
   * content and return an object with the plain text, an array of rich text
   * segments, each consisting of the text data and the corresponding style
   * data, and an array of style data per character. This array contains as many
   * elements as characters are contained in the plain text. Each element index
   * points to the effective style for the corresponding character.
   * Characters in this context are real visible characters (unicode code points
   * or graphemes) that may consist of several UTF16 code units. If you know
   * that your strings contain such characters, don't use plainText.length or
   * plainText.at(), since those only handle UTF16 code units and will lead
   * to wrong indexes. Use one of the methods below, instead, to access single
   * characters.
   *
   * @returns {object} The final rich text data.
   * @example
   * {
   *   plainText: 'Hello World',
   *   richText: [{text: 'Hello ', style: style1}, {text: 'World', style: style2}],
   *   styleAt: [style1, style1, style1, style1, style1, style1, style2, style2, style2, style2, style2]
   * }
   * const char = plainText.codePointAt();
   * const chars = [...plainText];
   * for(const char of plainText) {};
   * const segmenter = new Intl.Segmenter(undefined, {granularity: "grapheme"});
   * const chars = [...segmenter.segment(plainText)];
   */
  build() {
    let plainText  = '';
    const richText = [];
    const styleAt  = [];
    for(let segment of this.segments) {
      segment = {text: segment.text, style: segment.style ? segment.style.clone() : null};
      plainText += segment.text;
      richText.push(segment);
      let count = [...this.segmenter.segment(segment.text)].length;
      while(count--) styleAt.push(segment.style);
    }
    return {plainText, richText, styleAt};
  }

}
