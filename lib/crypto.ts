// Registry of supported coins + live rate helper.

export type Coin = {
  symbol: string; // e.g. "BTC"
  name: string; // e.g. "Bitcoin"
  coingeckoId: string; // id used by CoinGecko price API
  defaultNetwork: string;
  decimals: number; // how many decimals to display for the crypto amount
};

export const COINS: Coin[] = [
  { symbol: "BTC", name: "Bitcoin", coingeckoId: "bitcoin", defaultNetwork: "Bitcoin", decimals: 8 },
  { symbol: "XMR", name: "Monero", coingeckoId: "monero", defaultNetwork: "Monero", decimals: 6 },
  { symbol: "USDT", name: "Tether", coingeckoId: "tether", defaultNetwork: "TRC20", decimals: 2 },
  { symbol: "USDC", name: "USD Coin", coingeckoId: "usd-coin", defaultNetwork: "ERC20", decimals: 2 },
  { symbol: "ETH", name: "Ethereum", coingeckoId: "ethereum", defaultNetwork: "ERC20", decimals: 6 },
  { symbol: "SOL", name: "Solana", coingeckoId: "solana", defaultNetwork: "Solana", decimals: 4 },
  { symbol: "LTC", name: "Litecoin", coingeckoId: "litecoin", defaultNetwork: "Litecoin", decimals: 6 },
  { symbol: "BCH", name: "Bitcoin Cash", coingeckoId: "bitcoin-cash", defaultNetwork: "Bitcoin Cash", decimals: 6 },
  { symbol: "DOGE", name: "Dogecoin", coingeckoId: "dogecoin", defaultNetwork: "Dogecoin", decimals: 2 },
  { symbol: "TRX", name: "TRON", coingeckoId: "tron", defaultNetwork: "TRC20", decimals: 4 },
  { symbol: "XRP", name: "XRP", coingeckoId: "ripple", defaultNetwork: "XRP Ledger", decimals: 4 },
  { symbol: "BNB", name: "BNB", coingeckoId: "binancecoin", defaultNetwork: "BEP20", decimals: 6 },
  { symbol: "ADA", name: "Cardano", coingeckoId: "cardano", defaultNetwork: "Cardano", decimals: 4 },
  { symbol: "DAI", name: "Dai", coingeckoId: "dai", defaultNetwork: "ERC20", decimals: 2 },
];

export function getCoin(symbol: string): Coin | undefined {
  return COINS.find((c) => c.symbol.toUpperCase() === symbol.toUpperCase());
}

// Brand colours used for the coin badges in the crypto banner.
export const COIN_COLORS: Record<string, string> = {
  BTC: "#f7931a",
  XMR: "#ff6600",
  USDT: "#26a17b",
  USDC: "#2775ca",
  ETH: "#627eea",
  SOL: "#14f195",
  LTC: "#345d9d",
  BCH: "#0ac18e",
  DOGE: "#c2a633",
  TRX: "#ff060a",
  XRP: "#23292f",
  BNB: "#f3ba2f",
  ADA: "#0033ad",
  DAI: "#f5ac37",
};

/**
 * Fetch the live crypto amount for a given EUR total.
 * Uses CoinGecko's free API. Returns a formatted string, or null if
 * the rate could not be fetched (the caller should then show the EUR
 * total and ask the customer to send the equivalent).
 */
export async function eurToCrypto(
  eurAmount: number,
  coinSymbol: string
): Promise<string | null> {
  const coin = getCoin(coinSymbol);
  if (!coin) return null;
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin.coingeckoId}&vs_currencies=eur`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const rate = data?.[coin.coingeckoId]?.eur;
    if (!rate || rate <= 0) return null;
    const amount = eurAmount / rate;
    return amount.toFixed(coin.decimals);
  } catch {
    return null;
  }
}
