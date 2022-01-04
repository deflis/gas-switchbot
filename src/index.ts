import SheetService from './sheet.service';
import SwitchBot from './switchbot';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let global: any;

global.recordTemptures = (): void => {
  const sheetService = new SheetService();
  const tokenSheet = sheetService.getSheet('token');
  const token = tokenSheet.getRange(1, 2).getValue();
  console.log(`token: ${token}`);
  const switchbot = new SwitchBot(token);

  const { deviceList } = switchbot.getDevices();

  for (const device of deviceList) {
    console.log(`device: ${device.deviceName}`, device);
    if (device.deviceType === 'Meter') {
      const { deviceId, deviceName } = device;
      const { temperature, humidity } = switchbot.getTemperatureAndHumidity(deviceId);
      const ahumidity =
        (((217 * (6.1078 * 10 ** ((7.5 * temperature) / (temperature + 237.3)))) /
          (temperature + 273.15)) *
          humidity) /
        100;

      const now = new Date();
      const sheet = sheetService.getSheet(deviceName, (sheet) => {
        sheet.appendRow([`デバイス`, '日付', '温度', '湿度', '絶対湿度', `最新`]);
      });
      sheet.appendRow([deviceName, now, temperature, humidity / 100, ahumidity, 1]);
      const lastRow = sheet.getLastRow();
      if (lastRow !== 2) {
        sheet.getRange(lastRow - 1, 6).setValue(2);
      }
      sheet.getRange(lastRow - 1, 1, 1, 6).copyFormatToRange(sheet, 1, 6, lastRow, lastRow);
    }
  }
};
