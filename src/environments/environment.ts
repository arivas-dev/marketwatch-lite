export const environment = {
  production: false,
  coingeckoDemoApiKey: import.meta.env.VITE_COINGECKO_DEMO_API_KEY ?? '',
} as const;
