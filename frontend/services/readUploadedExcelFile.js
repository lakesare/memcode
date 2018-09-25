// ___why not use already-used exceljs?
//    because I couldn't make it worksheet.xlsx.read(with something other than Stream).
//    we can find how to read file as stream on input[type=file], but I decided to use xlsx for now.
import * as XLSX from 'xlsx';

// reads FIRST worksheet of the file's spreadsheet as an array of hashes
//
// @param file - event.target.files[0]
// => Promise([{ Region: 'Caribbean', ... }, {}])
const readUploadedExcelFile = (file) =>
  new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const data = new Uint8Array(event.target.result);

      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      resolve(XLSX.utils.sheet_to_json(worksheet));
    };
    fileReader.readAsArrayBuffer(file);
  });

export default readUploadedExcelFile;
