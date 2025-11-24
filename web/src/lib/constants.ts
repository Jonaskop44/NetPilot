export const API_URL_DEVELOPMENT = process.env
  .NEXT_PUBLIC_API_URL_DEVELOPMENT as string;

export const API_URL_PRODUCTION = process.env
  .NEXT_PUBLIC_API_URL_PRODUCTION as string;

export const isProduction = process.env.NODE_ENV === "production";

export const API_URL = API_URL_DEVELOPMENT;
