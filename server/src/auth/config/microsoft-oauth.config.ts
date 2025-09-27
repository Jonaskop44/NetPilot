import { registerAs } from '@nestjs/config';

export default registerAs('microsoftOAuth', () => ({
  clientID: process.env.AZURE_CLIENT_ID,
  clientSecret: process.env.AZURE_CLIENT_SECRET,
  callbackUrl: process.env.AZURE_REDIRECT_URL,
}));
