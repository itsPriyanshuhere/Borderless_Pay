import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';
const CACHE_DURATION = 5 * 60 * 1000;

interface PriceCache {
    [key: string]: {
        price: number;
        timestamp: number;
    };
}

const priceCache: PriceCache = {};

const TOKEN_MAP: Record<string, string> = {
    'QIE': 'qie-blockchain', 
    'ETH': 'ethereum',
    'SEP': 'ethereum', 
    'BTC': 'bitcoin',
    'USDT': 'tether',
};

export const getPrice = async (symbol: string): Promise<number | null> => {
    const coinId = TOKEN_MAP[symbol.toUpperCase()];
    if (!coinId) return null;

    const cached = priceCache[symbol];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.price;
    }

    try {
        const response = await axios.get(COINGECKO_API, {
            params: {
                ids: coinId,
                vs_currencies: 'usd',
            },
        });

        const price = response.data[coinId]?.usd;
        if (price) {
            priceCache[symbol] = {
                price,
                timestamp: Date.now(),
            };
            return price;
        }
        return null;
    } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error);
        return null;
    }
};
