import axios from "axios";

const COINGECKO_API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

export const fetchMarkets = async () => {
  try {
    const response = await axios.get(COINGECKO_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching market data from CoinGecko:", error);
    throw error;
  }
};
