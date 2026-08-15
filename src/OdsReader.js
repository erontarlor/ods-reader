import {promises as fs} from 'node:fs';
import {strFromU8, unzip} from 'fflate';
import CellBuilder from './CellBuilder.js';
import ContentParser from './ContentParser.js';
import StyleResolver from './StyleResolver.js';
import StylesParser from './StylesParser.js';

/**
 * Central class for reading ODS files.
 */
export default class OdsReader {

  /**
   * Read an ODS file from a buffer.
   *
   * @param {Buffer|Uint8Array} buffer   The byte buffer with file content.
   * @param {Function}          callback The callback function called for each cell.
   */
  static async readBuffer(buffer, callback) {
    if(!(buffer instanceof Uint8Array)) throw new TypeError('buffer must be a Buffer or Uint8Array');
    if(typeof callback !== 'function') throw new TypeError('callback must be a function');
    const zip           = await OdsReader.#unzipAsync(buffer);
    const stylesXml     = OdsReader.#getXml(zip, 'styles.xml');
    const contentXml    = OdsReader.#getXml(zip, 'content.xml');
    const styleResolver = new StyleResolver(new StylesParser().parse(stylesXml).parse(contentXml).resolveInheritance().getStyles());
    const cellBuilder   = new CellBuilder(callback);
    new ContentParser(styleResolver, cellBuilder).parse(contentXml);
  }

  /**
   * Read an ODF file from disk.
   *
   * @param {string}    filename The name of the file to read.
   * @param {Function}  callback The callback function called for each cell.
   */
  static async readFile(filename, callback) {
    if(typeof filename !== 'string' || filename.length === 0) throw new TypeError('filename must be a non-empty string');
    await OdsReader.readBuffer(await fs.readFile(filename), callback);
  }

  static #unzipAsync(buffer) {
    return new Promise((resolve, reject) => {
      unzip(buffer, (error, files) => {
        error ? reject(error) : resolve(files);
      });
    });
  }

  static #getXml(zip, name) {
    const file = zip[name];
    if(!file) throw new Error(`Missing file "${name}" in ODS archive`);
    return strFromU8(file);
  }

}
