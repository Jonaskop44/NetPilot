import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import * as https from 'https';

@Injectable()
export class FirewallService {
  private readonly logger = new Logger(FirewallService.name);
  private apiUrl = process.env.OPNSENSE_API_URL;
  private apiKey = process.env.OPNSENSE_API_KEY;
  private apiSecret = process.env.OPNSENSE_API_SECRET;

  private client = axios.create({
    timeout: 10000, // 10 second timeout
    httpsAgent: new https.Agent({
      rejectUnauthorized: false, // erlaubt selbstsignierte Zertifikate
    }),
    auth: {
      username: this.apiKey || '',
      password: this.apiSecret || '',
    },
  });

  async getRules() {
    this.logger.log('Fetching firewall rules from OPNsense API...');
    this.logger.log(`API URL: ${this.apiUrl}`);

    try {
      // Validate environment variables
      this.validateConfiguration();

      const res = await this.retryRequest(async () => {
        return await this.client.get(
          `${this.apiUrl}/firewall/filter/searchRule`,
        );
      });

      this.logger.log('Successfully fetched firewall rules');
      return res.data;
    } catch (error) {
      return this.handleApiError(error, 'Failed to fetch firewall rules');
    }
  }

  async addRule(rule: any) {
    this.logger.log('Adding new firewall rule...');

    try {
      // Validate environment variables
      this.validateConfiguration();

      const res = await this.retryRequest(async () => {
        return await this.client.post(
          `${this.apiUrl}/firewall/filter/addRule`,
          rule,
        );
      });

      this.logger.log('Successfully added firewall rule');
      return res.data;
    } catch (error) {
      return this.handleApiError(error, 'Failed to add firewall rule');
    }
  }

  private validateConfiguration() {
    if (!this.apiUrl) {
      throw new Error(
        'OPNSENSE_API_URL environment variable is not configured',
      );
    }
    if (!this.apiKey) {
      throw new Error(
        'OPNSENSE_API_KEY environment variable is not configured',
      );
    }
    if (!this.apiSecret) {
      throw new Error(
        'OPNSENSE_API_SECRET environment variable is not configured',
      );
    }
  }

  async testConnection(): Promise<boolean> {
    this.logger.log('Testing OPNsense API connectivity...');

    try {
      this.validateConfiguration();

      // Test with a simple API endpoint that should always be available
      const res = await this.client.get(`${this.apiUrl}/core/firmware/status`);

      if (res.status === 200) {
        this.logger.log('OPNsense API connectivity test successful');
        return true;
      } else {
        this.logger.warn(`Unexpected response status: ${res.status}`);
        return false;
      }
    } catch (error) {
      this.logger.error('OPNsense API connectivity test failed:', error);
      return false;
    }
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;

        // Don't retry on authentication or configuration errors
        if (error instanceof AxiosError) {
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            throw error;
          }
          if (error.message.includes('environment variable')) {
            throw error;
          }
        }

        if (attempt === maxRetries) {
          this.logger.error(`Request failed after ${maxRetries} attempts`);
          throw lastError;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
        this.logger.warn(
          `Request attempt ${attempt} failed, retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  private handleApiError(error: any, message: string): never {
    if (error instanceof AxiosError) {
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        this.logger.error(
          `${message}: Connection timeout - OPNsense API is not reachable at ${this.apiUrl}`,
        );
        throw new Error(
          `Connection timeout: Unable to reach OPNsense API at ${this.apiUrl}. Please check if the OPNsense server is running and accessible.`,
        );
      } else if (error.code === 'ECONNREFUSED') {
        this.logger.error(
          `${message}: Connection refused - Service may not be running`,
        );
        throw new Error(
          `Connection refused: OPNsense API service appears to be down or not accessible at ${this.apiUrl}`,
        );
      } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
        this.logger.error(
          `${message}: DNS resolution failed for ${this.apiUrl}`,
        );
        throw new Error(
          `DNS resolution failed: Cannot resolve hostname ${this.apiUrl}. Please check the API URL.`,
        );
      } else if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const statusText = error.response.statusText;
        this.logger.error(`${message}: HTTP ${status} ${statusText}`);

        if (status === 401) {
          throw new Error(
            'Authentication failed: Please check your API key and secret',
          );
        } else if (status === 403) {
          throw new Error(
            'Access forbidden: Your API credentials do not have sufficient permissions',
          );
        } else if (status === 404) {
          throw new Error(
            'API endpoint not found: Please check your OPNsense version and API URL',
          );
        } else {
          throw new Error(`HTTP ${status}: ${statusText}`);
        }
      } else {
        this.logger.error(`${message}: ${error.message}`);
        throw new Error(`Network error: ${error.message}`);
      }
    } else {
      this.logger.error(`${message}: ${error.message}`);
      throw new Error(`Unexpected error: ${error.message}`);
    }
  }
}
