import * as Excel from 'exceljs/dist/exceljs.min.js';
import FileSaver from 'file-saver';

const createAndDownloadExcelFile = (arrayOfHashes, fileName, worksheetName) => {
  // no content? just don't do a thing.
  if (arrayOfHashes.length === 0) return;

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet(worksheetName, {
    properties: { showGridLines: true }
  });

  // add the first row of column headers
  const titles = Object.keys(arrayOfHashes[0]);
  worksheet.columns = titles.map((title) => ({
    header: title, key: title, width: 20
  }));
  // add all the other rows of actual content
  worksheet.addRows(arrayOfHashes);

  // make all rows wrapText
  worksheet.eachRow((row) => {
    row.alignment = { wrapText: true, vertical: 'top' };
    row.font = { size: 10 };
  });
  // make first row bold
  worksheet.getRow(1).font = { size: 12, bold: true };

  workbook.xlsx.writeBuffer()
    .then((buffer) =>
      FileSaver.saveAs(
        new Blob(
          [buffer],
          { type: 'application/octet-stream' }
        ), fileName
      )
    );
};

export default createAndDownloadExcelFile;
