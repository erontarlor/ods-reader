/**
 * Builds the description of a table cell.
 */
export default class CellBuilder {

  /**
   * @param {Function} callback A function to be called with the cell data.
   */
  constructor(callback) {
    this.callback       = callback;
    this.coveredCellMap = new Map();
  }

  /**
   * Must be called whenever a new sheet begins.
   *
   * @returns {CellBuilder} This CellBuilder.
   */
  beginSheet() {
    this.coveredCellMap.clear();
    return this;
  }

  /**
   * Registers the given Cell for the Cell's span of rows and columns
   * and calls the callback function with the Cell's data.
   *
   * @param   {Cell}        cell The Cell object.
   * @returns {CellBuilder}      This CellBuilder.
   */
  emitCell(cell) {
    if(cell.rowSpan > 1 || cell.columnSpan > 1) this.#registerCoveredArea(cell);
    return this.#callCallback(cell);
  }

  /**
   * Gets the registered master Cell for the given cell
   * and calls the callback function with the Cell's data.
   *
   * @param   {Cell}        cell The Cell object.
   * @returns {CellBuilder}      This CellBuilder.
   */
  emitCoveredCell(cell) {
    let master = this.coveredCellMap.get(this.#generateKey(cell.row, cell.column));
    if(!master) return this.#callCallback(cell);
    master = master.clone();
    master.row     = cell.row;
    master.column  = cell.column;
    master.covered = cell.covered;
    return this.#callCallback(master);
  }

  #registerCoveredArea(cell) {
    cell = cell.clone();
    for(let row = 0; row < cell.rowSpan; row++) {
      for(let column = 0; column < cell.columnSpan; column++) {
        if(row === 0 && column === 0) continue;
        this.coveredCellMap.set(this.#generateKey(cell.row+row, cell.column+column), cell);
      }
    }
    return this;
  }

  #generateKey(row, column) {
    return `${row}:${column}`;
  }

  #callCallback(cell) {
    this.callback(cell);
    return this;
  }

}
