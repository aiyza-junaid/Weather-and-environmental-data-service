const { responseUtils } = require("../utils");
const { dummyService } = require("../services");

const XLSX = require('xlsx');
const path = require('path');

const readExcelData = () => {
  const filePath = path.join(__dirname, '..', 'data', 'Crop_Calendar_Data_All.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Assuming you want the first sheet
  const worksheet = workbook.Sheets[sheetName];

  // Convert the worksheet to an array of arrays
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const [fieldsRow, subFieldsRow, ...dataRows] = rows;

  const data = dataRows.map((row) => {
    const rowData = {};
    for (let i = 0; i < fieldsRow.length; i++) {
      const field = fieldsRow[i];
      const subField = subFieldsRow[i];
      const value = row[i];

      if (subField) {
        if (!rowData[field]) {
          rowData[field] = {};
        }
        rowData[field][subField] = value;
      } else {
        rowData[field] = value;
      }
    }
    return rowData;
  });

  return data;
}

module.exports = { readExcelData };

const recommendationController = {
  getData: async (req, res) => {
    try {
      const data = readExcelData();
      return responseUtils.handleSuccess(res, data, "Data fetched successfully");
    } catch (error) {
      console.log(error);
      return responseUtils.handleFailure(res, error);
    }
  },

};

module.exports = recommendationController;