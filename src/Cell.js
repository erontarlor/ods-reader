/**
 * General data object for storing cell information.
 */
export default class Cell {

  constructor() {
    this.sheetName    = null;
    this.row          = 0;
    this.column       = 0;
    this.plainText    = '';
    this.richText     = [];
    this.styleAt      = [];
    this.rowSpan      = 1;
    this.columnSpan   = 1;
    this.masterRow    = 0;
    this.masterColumn = 0;
    this.value        = null;
    this.formula      = null;
    this.valueType    = null;
    this.comment      = null;
    this.covered      = false;
  }

  /**
   * Creates a shallow copy of this cell.
   *
   * @returns {Cell} The created copy.
   */
  clone() {
    const copy = new Cell();
    copy.sheetName    = this.sheetName;
    copy.row          = this.row;
    copy.column       = this.column;
    copy.plainText    = this.plainText;
    copy.richText     = this.richText;
    copy.styleAt      = this.styleAt;
    copy.rowSpan      = this.rowSpan;
    copy.columnSpan   = this.columnSpan;
    copy.masterRow    = this.masterRow;
    copy.masterColumn = this.masterColumn;
    copy.value        = this.value;
    copy.formula      = this.formula;
    copy.valueType    = this.valueType;
    copy.comment      = this.comment;
    copy.covered      = this.covered;
    return copy;
  }

}
