const BASE_URL = 'https://api.switch-bot.com';

type SwitchBotResult<T> = {
  statusCode: number;
  body: T;
  message: string;
};

type Meter = {
  deviceId: string;
  deviceType: 'Meter';
  hubDeviceId: string;
  humidity: number;
  temperature: number;
};

type Devices = {
  deviceList: {
    deviceId: string;
    deviceName: string;
    deviceType: string;
    enableCloudService: boolean;
    hubDeviceId: string;
  }[];
  infraredRemoteList: {
    deviceId: string;
    deviceName: string;
    remoteType: string;
    hubDeviceId: string;
  }[];
};

export default class SwitchBot {
  private options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
  constructor(token: string) {
    this.options = {
      headers: {
        Authorization: token,
      },
    };
  }
  getData<T>(path: string): SwitchBotResult<T> {
    const url = `${BASE_URL}/v1.0/${path}`;
    const data = UrlFetchApp.fetch(url, this.options);
    return JSON.parse(data.getContentText());
  }

  getDevices(): Devices {
    const { body } = this.getData<Devices>(`devices`);
    return body;
  }

  getTemperatureAndHumidity(id: string): Meter {
    const { body } = this.getData<Meter>(`devices/${id}/status`);
    return body;
  }
}
