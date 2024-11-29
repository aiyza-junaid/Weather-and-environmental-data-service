const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

function convertExcelToJson() {
  const excelFilePath = path.join(__dirname, '..', 'data', 'Crop_Calendar_Data_All.xlsx');
  const jsonFilePath = path.join(__dirname, '..', 'data', 'Crop_Calendar_Data_All.json');

  const workbook = XLSX.readFile(excelFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Column mappings (0-based index)
  const columnMappings = {
    'Country Name': 0,
    'Crop': 1,
    'AgroEcological Zone': 2,
    'Additional information': 3,
    'Early Sowing': {
      'Day': 4,
      'Month': 5
    },
    'Later Sowing': {
      'Day': 6,
      'Month': 7
    },
    'All year': 8,
    'Sowing rate': {
      'Value': 9,
      'Unit': 10
    },
    'Growing period': {
      'Value': 11,
      'Period': 12
    },
    'Early harvest': {
      'Day': 13,
      'Month': 14
    },
    'Late harvest': {
      'Day': 15,
      'Month': 16
    },
    'Temperature': {
      'Min': 17,
      'Optimal': 18,
      'Max': 19
    },
    'Precipitation': {
      'Value': 20,
      'Unit': 21
    },
    'AgroEcological Zone Description': 22,
    'AgroEcological Zone Practices': 23,
    'AgroEcological Zone Units': 24,
    'Comments En': 25,
    'Comments ES': 26,
    'Comments FR': 27,
    'Comments ZH': 28,
    'Comments AR': 29,
    'Comments RU': 30,
  };

  // Process each data row starting from row 2 (1-based)
  const data = [];
  let R = 2; // Skip header rows

  while (true) {
    // Check if we've reached the end of data
    const firstCell = worksheet[XLSX.utils.encode_cell({r: R, c: 0})];
    if (!firstCell) break;

    let rowData = {};

    // Process regular fields
    for (let field in columnMappings) {
      if (typeof columnMappings[field] === 'number') {
        const cell = worksheet[XLSX.utils.encode_cell({r: R, c: columnMappings[field]})];
        rowData[field] = cell ? cell.v.toString() : '';
      } else {
        // Process nested fields
        rowData[field] = {};
        for (let subField in columnMappings[field]) {
          const cell = worksheet[XLSX.utils.encode_cell({
            r: R, 
            c: columnMappings[field][subField]
          })];
          rowData[field][subField] = cell ? cell.v.toString() : '';
        }
      }
    }

    data.push(rowData);
    R++;
  }

  // Write the data to the JSON file
  fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
  console.log(`Excel data has been converted to JSON and saved to ${jsonFilePath}`);
}

convertExcelToJson();