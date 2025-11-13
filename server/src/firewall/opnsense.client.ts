import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import {
  OPNSENSE_API_KEY,
  OPNSENSE_API_SECRET,
  OPNSENSE_API_URL,
} from 'src/lib/constants';

export class OpnsenseClient {
  private client: AxiosInstance;
  private apiUrl: string;

  constructor() {
    this.apiUrl = OPNSENSE_API_URL;
    const apiKey = OPNSENSE_API_KEY;
    const apiSecret = OPNSENSE_API_SECRET;

    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: 5000,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // erlaubt selbstsignierte Zertifikate
      }),
      auth: {
        username: apiKey,
        password: apiSecret,
      },
    });
  }

  public getClient() {
    return this.client;
  }
}
