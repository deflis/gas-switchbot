type Sheet = GoogleAppsScript.Spreadsheet.Sheet;
type Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;

export default class SheetService {
  constructor(private spreadsheet: Spreadsheet = SpreadsheetApp.getActiveSpreadsheet()) {}

  getSheet(name: string, initilizer?: (sheet: Sheet) => void): Sheet {
    const sheet = this.spreadsheet.getSheetByName(name);
    if (sheet) return sheet;

    const newSheet = this.spreadsheet.insertSheet();
    newSheet.setName(name);
    if (initilizer) initilizer(newSheet);
    return newSheet;
  }
}
