
const getHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; 
    }
    return Math.abs(hash);
};

const generateData = (basePrice, volatility, points) => {
    let price = basePrice;
    const data = [];
    const now = new Date();

    for (let i = 0; i < points; i++) {
        const change = (Math.random() - 0.5) * volatility;
        price += change;
        if (price < 0.000001) price = 0.000001;

        const time = new Date(now.getTime() - (points - 1 - i) * 1000 * 60 * 60); 

        data.push({
            time: time.toISOString(),
            price: price,
            volume: Math.random() * 1000 + 500
        });
    }
    return data;
};

export const getCoinData = (coinId, timeRange, currentPrice = null) => {
    let points = 24; 
    let volatility = 500;
    let basePrice = currentPrice || 100;

    if (basePrice < 1) volatility = basePrice * 0.1;
    else if (basePrice < 100) volatility = basePrice * 0.05;
    else volatility = basePrice * 0.02;

    if (timeRange === '7D') {
        points = 7 * 24;
        volatility *= 2;
    } else if (timeRange === '30D') {
        points = 30 * 4;
        volatility *= 4;
    }

    return generateData(basePrice, volatility, points);
};

export const COINS = [
    {
        id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 88062.00, price_change_percentage_24h: -2.04, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', market_cap: 1770000000000,
        total_volume: 45200000000, circulating_supply: 19600000, high_24h: 90000, low_24h: 87500
    },
    {
        id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 2938.54, price_change_percentage_24h: -2.43, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', market_cap: 356600000000,
        total_volume: 15800000000, circulating_supply: 120100000, high_24h: 3050, low_24h: 2900
    }
];

