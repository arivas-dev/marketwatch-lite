import type { Coin } from '../models/coin.model';

export const DEMO_COINS: readonly Coin[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 64_231.42,
    market_cap: 1_270_000_000_000,
    market_cap_rank: 1,
    price_change_percentage_24h: 1.24,
    price_change_percentage_1h_in_currency: 0.08,
    total_volume: 28_500_000_000,
    high_24h: 64_890.0,
    low_24h: 63_120.5,
    last_updated: '2026-05-07T12:00:00.000Z',
    sparkline_in_7d: {
      price: [
        63_100, 63_280, 63_450, 63_200, 63_550, 63_800, 64_050, 63_900, 64_120, 64_231,
      ],
    },
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3_412.18,
    market_cap: 410_000_000_000,
    market_cap_rank: 2,
    price_change_percentage_24h: -0.42,
    price_change_percentage_1h_in_currency: -0.11,
    total_volume: 14_200_000_000,
    high_24h: 3_480.0,
    low_24h: 3_360.0,
    last_updated: '2026-05-07T12:00:00.000Z',
    sparkline_in_7d: {
      price: [
        3_360, 3_380, 3_395, 3_370, 3_400, 3_418, 3_405, 3_390, 3_408, 3_412,
      ],
    },
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 148.92,
    market_cap: 72_000_000_000,
    market_cap_rank: 5,
    price_change_percentage_24h: 2.05,
    price_change_percentage_1h_in_currency: 0.35,
    total_volume: 3_100_000_000,
    high_24h: 152.1,
    low_24h: 145.0,
    last_updated: '2026-05-07T12:00:00.000Z',
    sparkline_in_7d: {
      price: [
        145.2, 146.0, 147.1, 146.4, 147.8, 148.2, 148.9, 148.1, 148.6, 148.92,
      ],
    },
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    current_price: 0.52,
    market_cap: 18_500_000_000,
    market_cap_rank: 8,
    price_change_percentage_24h: -0.18,
    price_change_percentage_1h_in_currency: 0.02,
    total_volume: 420_000_000,
    high_24h: 0.53,
    low_24h: 0.51,
    last_updated: '2026-05-07T12:00:00.000Z',
    sparkline_in_7d: {
      price: [
        0.508, 0.512, 0.515, 0.511, 0.518, 0.521, 0.519, 0.517, 0.521, 0.52,
      ],
    },
  },
];
