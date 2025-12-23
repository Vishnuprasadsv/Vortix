import { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaBitcoin, FaEthereum, FaChartBar, FaSearch } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const TopGainers = ({ coins = [] }) => {
    const gainers = [...coins]
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 3);

    return (
        <div className="bg-surface rounded-xl border border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
                <FaArrowUp className="text-green-500" />
                <h3 className="text-sm font-bold text-text-muted uppercase">Top Gainers (24H)</h3>
            </div>
            <div className="space-y-4">
                {gainers.map(coin => (
                    <div key={coin.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <img src={coin.image} alt={coin.symbol} className="w-6 h-6 rounded-full" />
                            <span className="font-bold text-white uppercase">{coin.symbol}</span>
                        </div>
                        <span className="text-green-500 font-medium">+{(coin.price_change_percentage_24h || 0).toFixed(2)}%</span>
                    </div>
                ))}
                {gainers.length === 0 && <div className="text-text-muted text-sm">Loading...</div>}
            </div>
        </div>
    );
};

export const TopLosers = ({ coins = [] }) => {
    const losers = [...coins]
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, 3);

    return (
        <div className="bg-surface rounded-xl border border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
                <FaArrowDown className="text-red-500" />
                <h3 className="text-sm font-bold text-text-muted uppercase">Top Losers (24H)</h3>
            </div>
            <div className="space-y-4">
                {losers.map(coin => (
                    <div key={coin.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <img src={coin.image} alt={coin.symbol} className="w-6 h-6 rounded-full" />
                            <span className="font-bold text-white uppercase">{coin.symbol}</span>
                        </div>
                        <span className="text-red-500 font-medium">{(coin.price_change_percentage_24h || 0).toFixed(2)}%</span>
                    </div>
                ))}
                {losers.length === 0 && <div className="text-text-muted text-sm">Loading...</div>}
            </div>
        </div>
    );
};

export const MarketSentiment = () => {
    const data = [
        { name: 'Greed', value: 65, color: '#FF5F1F' },
        { name: 'Fear', value: 35, color: '#333' },
    ];

    return (
        <div className="bg-surface rounded-xl border border-gray-800 p-6 flex flex-col justify-between">
            <div>
                <h3 className="text-xs font-bold text-text-muted uppercase mb-1">Market Sentiment</h3>
                <h2 className="text-3xl font-bold text-white mb-4">Bullish</h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[65%] rounded-full"></div>
                </div>
                <div className="w-16 h-16 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={15}
                                outerRadius={25}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="flex justify-between text-xs text-text-muted mt-2">
                <span>Fear</span>
                <span>Greed (65%)</span>
            </div>
        </div>
    );
};

export const Watchlist = ({ onCoinSelect, selectedCoinId, coins = [] }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const displayedCoins = isExpanded ? coins : coins.slice(0, 5);

    return (
        <div className={`bg-surface rounded-xl border border-gray-800 p-6 flex flex-col ${isExpanded ? 'h-auto z-10 relative' : 'h-full'}`}>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <FaChartBar className="text-primary" />
                    <h3 className="text-lg font-bold text-white">Watchlist</h3>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-primary hover:text-orange-400 transition-colors cursor-pointer"
                >
                    {isExpanded ? 'Show Less' : 'View All'}
                </button>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-125 custom-scrollbar">
                {displayedCoins.map((coin, idx) => (
                    <div
                        key={coin.id}
                        onClick={() => onCoinSelect(coin)}
                        className={`flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border ${selectedCoinId === coin.id ? 'border-primary/50 bg-primary/10' : 'border-transparent'}`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-text-muted text-xs w-4">
                                {idx + 1}
                            </span>
                            <img src={coin.image} alt={coin.symbol} className="w-8 h-8 rounded-full" />
                            <div>
                                <div className="font-bold text-white text-sm uppercase">{coin.symbol}</div>
                                <div className="text-text-muted text-xs">{coin.name}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-white text-sm">
                                ${(coin.current_price || coin.price || 0).toLocaleString()}
                            </div>
                            <div className={`${(coin.price_change_percentage_24h || coin.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'} text-xs`}>
                                {(coin.price_change_percentage_24h || coin.change || 0) > 0 ? '+' : ''}{(coin.price_change_percentage_24h || coin.change || 0).toFixed(2)}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isExpanded && (
                <div className="mt-4 text-center">
                    <p className="text-text-muted text-xs">Scroll to view more...</p>
                </div>
            )}
        </div>
    );
};
