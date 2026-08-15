import sax from 'sax';
import Cell from './Cell.js';
import RichTextBuilder from './RichTextBuilder.js';
import Style from './Style.js';
import XmlContext from './XmlContext.js';

/**
 * Parses the content.xml file of an ODS document.
 */
export default class ContentParser {

  /**
   * @param {StyleResolver} styleResolver Resolver used to look up styles.
   * @param {CellBuilder}   cellBuilder   Invoked for every parsed table cell.
   */
  constructor(styleResolver, cellBuilder) {
    this.styleResolver      = styleResolver;
    this.cellBuilder        = cellBuilder;
    this.context            = new XmlContext();
    this.richTextBuilder    = new RichTextBuilder();
    this.sheetName          = null;
    this.row                = 0;
    this.column             = 0;
    this.columnRepeat       = 1;
    this.rowRepeat          = 1;
    this.currentRowCells    = [];
    this.currentRowSpan     = 1;
    this.currentColumnSpan  = 1;
    this.insideParagraph    = false;
    this.insideAnnotation   = false;
    this.currentAnnotation  = null;
    this.annotations        = [];
    this.styleStack         = [];
  }

  /**
   * Parses a content.xml document.
   *
   * @param   {string}        xml XML document.
   * @returns {ContentParser}     This ContentParser.
   */
  parse(xml) {
    const parser = sax.parser(true, {xmlns: false, trim: false, normalize: false});
    parser.onopentag  = (node)  => {this.#onOpenTag(node);}
    parser.ontext     = (text)  => {this.#onText(text);}
    parser.onclosetag = (name)  => {this.#onCloseTag(name);}
    parser.onerror    = (error) => {throw error;};
    parser.write(xml).close();
    return this;
  }

  #onOpenTag(node) {
    if(this.insideAnnotation) return this;
    this.context.push(node);
    switch(node.name) {
      case 'table:table':              return this.#beginTable(node);
      case 'table:table-row':          return this.#beginRow(node);
      case 'table:table-cell':         return this.#beginCell(node);
      case 'table:covered-table-cell': return this.#beginCell(node);
      case 'text:p':                   return this.#beginParagraph(node);
      case 'text:span':                return this.#beginSpan(node);
      case 'text:a':                   return this.#beginHyperlink(node);
      case 'office:annotation':        return this.#beginAnnotation(node);
      case 'text:s':                   return this.#appendSpaces(node);
      case 'text:tab':                 return this.#appendTabs(node);
      case 'text:line-break':          return this.#appendLineBreaks(node);
      default:                         return this;
    }
  }

  #beginTable(node) {
    this.sheetName = node.attributes['table:name'] ?? null;
    this.row       = 0;
    this.column    = 0;
    this.cellBuilder.beginSheet();
    return this;
  }

  #beginRow(node) {
    this.column          = 0;
    this.currentRowCells = [];
    this.rowRepeat       = this.#getIntegerAttribute(node, 'table:number-rows-repeated', 1);
    return this;
  }

  #beginCell(node) {
    this.styleStack         = [];
    this.columnRepeat       = this.#getIntegerAttribute(node, 'table:number-columns-repeated', 1);
    this.currentRowSpan     = this.#getIntegerAttribute(node, 'table:number-rows-spanned', 1);
    this.currentColumnSpan  = this.#getIntegerAttribute(node, 'table:number-columns-spanned', 1);
    this.richTextBuilder.clear();
    return this.#pushMergedStyle(node.attributes['table:style-name'], 'table-cell');
  }

  #beginParagraph(node) {
    this.insideParagraph = true;
    return this.#pushMergedStyle(node.attributes['text:style-name'], 'paragraph');
  }

  #beginSpan(node) {
    return this.#pushMergedStyle(node.attributes['text:style-name'], 'text');
  }

  #beginHyperlink(node) {
    const style = this.#pushStyle();
    style.hyperlink      = node.attributes["xlink:href"] ?? null;
    style.hyperlinkFrame = node.attributes["office:target-frame-name"] ?? null;
    return this;
  }

  #beginAnnotation(node) {
    this.insideAnnotation = true;
    return this;
  }

  #appendSpaces(node) {
    this.richTextBuilder.appendSpaces(this.#getCurrentStyle(), this.#getIntegerAttribute(node, 'text:c', 1));
    return this;
  }

  #appendTabs(node) {
    this.richTextBuilder.appendTabs(this.#getCurrentStyle(), this.#getIntegerAttribute(node, "text:c", 1));
    return this;
  }

  #appendLineBreaks(node) {
    this.richTextBuilder.appendLineBreaks(this.#getCurrentStyle(), this.#getIntegerAttribute(node, "text:c", 1));
    return this;
  }

  #onText(text) {
    if(this.insideAnnotation) return this;
    if(!this.insideParagraph) return this;
    this.richTextBuilder.append(text, this.#getCurrentStyle());
    return this;
  }

  #onCloseTag(name) {
    if(this.insideAnnotation && name !== 'office:annotation') return this;
    switch(name) {
      case 'table:table-row':          return this.#endRow();
      case 'table:table-cell':         return this.#endNormalCell();
      case 'table:covered-table-cell': return this.#endCoveredCell();
      case 'text:p':                   return this.#endParagraph();
      case 'text:span':                return this.#endSpan();
      case 'text:a':                   return this.#endHyperlink();
      case 'office:annotation':        return this.#endAnnotation();
      default:                         return this.#endTag();
    }
  }

  #endRow() {
    const maxRow = this.row+this.rowRepeat;
    while(this.row < maxRow) {
      for(const cell of this.currentRowCells) {
        cell.covered ? this.cellBuilder.emitCoveredCell(this.#adaptCellToCurrentRow(cell)) : this.cellBuilder.emitCell(this.#adaptCellToCurrentRow(cell));
      }
      this.row++;
    }
    return this.#endTag();
  }

  #adaptCellToCurrentRow(cell) {
    if(this.row === cell.row) return cell;
    cell = cell.clone();
    cell.row       = this.row;
    cell.masterRow = this.row;
    return cell;
  }

  #endNormalCell() {
    return this.#endCell(false);
  }

  #endCoveredCell() {
    return this.#endCell(true);
  }

  #endCell(covered) {
    const {plainText, richText, styleAt} = this.richTextBuilder.build();
    const maxColumn  = this.column+this.columnRepeat;
    while(this.column < maxColumn) {
      this.currentRowCells.push(this.#createCell(plainText, richText, styleAt, covered));
      this.column++;
    }
    return this.#endTag();
  }

  #createCell(plainText, richText, styleAt,covered) {
    const cell = new Cell();
    cell.sheetName    = this.sheetName;
    cell.row          = this.row;
    cell.column       = this.column;
    cell.plainText    = plainText;
    cell.richText     = richText;
    cell.styleAt      = styleAt;
    cell.rowSpan      = this.currentRowSpan;
    cell.columnSpan   = this.currentColumnSpan;
    cell.masterRow    = this.row;
    cell.masterColumn = this.column;
    cell.covered      = covered;
    return cell;
  }

  #endParagraph() {
    this.#popStyle();
    this.insideParagraph = false;
    this.richTextBuilder.breakSegment();
    return this.#endTag();
  }

  #endSpan() {
    this.#popStyle();
    return this.#endTag();
  }

  #endHyperlink() {
    this.#popStyle();
    return this.#endTag();
  }

  #endAnnotation() {
    this.insideAnnotation = false;
    return this;
  }

  #endTag() {
    this.context.pop();
    return this;
  }

  #getIntegerAttribute(node, name, defaultValue = 1) {
    const value = node.attributes[name];
    if(value === undefined) return defaultValue;
    const number = Number.parseInt(value, 10);
    return Number.isFinite(number) ? number : defaultValue;
  }

  #pushMergedStyle(name, family) {
    return this.#mergeReferencedStyle(name, family, this.#pushStyle());
  }

  #pushStyle() {
    const style = this.styleStack.length > 0 ? this.#getCurrentStyle().clone() : new Style();
    this.styleStack.push(style);
    return style;
  }

  #mergeReferencedStyle(name, family, style) {
    if(!name) return this;
    const resolvedStyle = this.styleResolver.getStyle(name, family);
    if(!resolvedStyle) return this;
    style.merge(resolvedStyle);
    style.appliedStyleNames.push({family, name});
    return this;
  }

  #popStyle() {
    if(this.styleStack.length > 1) this.styleStack.pop();
  }

  #getCurrentStyle() {
    return this.styleStack.at(-1);
  }

}
