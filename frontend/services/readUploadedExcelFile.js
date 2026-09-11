// ___why not use already-used exceljs?
//    because I couldn't make it worksheet.xlsx.read(with something other than Stream).
//    we can find how to read file as stream on input[type=file], but I decided to use xlsx for now.
// [claude comment] resolved - workbook.xlsx.load() takes an ArrayBuffer directly, no Stream needed, so we dropped xlsx (unpatched prototype pollution + ReDoS, no fix on npm).
import * as Excel from 'exceljs/dist/exceljs.min.js';

// reads FIRST worksheet of the file's spreadsheet as an array of hashes
//
// @param file - event.target.files[0]
// => Promise([{ Region: 'Caribbean', ... }, {}])
const readUploadedExcelFile = (file) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onerror = () => reject(fileReader.error);
    fileReader.onload = async (event) => {
      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(event.target.result);
      const worksheet = workbook.worksheets[0];

      const headers = [];
      worksheet.getRow(1).eachCell((cell, columnNumber) => {
        headers[columnNumber] = cell.text;
      });

      const rows = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const hash = {};
        row.eachCell((cell, columnNumber) => {
          if (headers[columnNumber] === undefined) return;
          hash[headers[columnNumber]] = cell.text;
        });
        if (Object.keys(hash).length > 0) rows.push(hash);
      });

      resolve(rows);
    };
    fileReader.readAsArrayBuffer(file);
  });

export default readUploadedExcelFile;
