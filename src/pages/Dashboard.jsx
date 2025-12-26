import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter } from 'react-icons/fa';
import ChartWidget from '../components/ChartWidget';
import { TopGainers, TopLosers, MarketSentiment, Watchlist } from '../components/DashboardWidgets';
import { fetchMarkets } from '../services/api';
import { COINS as LOADING_PLACEHOLDER } from '../services/mockData';
import Loader from '../components/Loader';

const Dashboard = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCoin, setSelectedCoin] = useState(LOADING_PLACEHOLDER[0]);
    const [comparisonCoin, setComparisonCoin] = useState(null);
    const [timeRange, setTimeRange] = useState('24H');
    const [chartType, setChartType] = useState('area'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('default');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const getCoins = async () => {
            try {
                const data = await fetchMarkets();
                setCoins(data);
                if (data.length > 0) {
                    setSelectedCoin(data[0]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
                setCoins(LOADING_PLACEHOLDER);
                setSelectedCoin(LOADING_PLACEHOLDER[0]);
                setLoading(false);
            }
        };
        getCoins();
    }, []);

    const handleCoinSelect = (coin) => {
        setSelectedCoin(coin);
        setComparisonCoin(null); 
    };

    const getSortedCoins = () => {
        let sorted = [...coins];
        if (searchQuery) {
            sorted = sorted.filter(c =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        switch (sortOption) {
            case 'price-desc': return sorted.sort((a, b) => b.current_price - a.current_price);
            case 'price-asc': return sorted.sort((a, b) => a.current_price - b.current_price);
            case 'change-desc': return sorted.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
            case 'change-asc': return sorted.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
            default: return sorted;
        }
    };

    const sortedCoins = getSortedCoins();

    if (loading) {
        return <Loader />;
    }

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div className="flex items-center gap-4 mb-8 relative z-50">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search coins..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-surface border border-gray-800 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                        {searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50 custom-scrollbar">
                                {sortedCoins.map(coin => (
                                    <button
                                        key={coin.id}
                                        onClick={() => {
                                            handleCoinSelect(coin);
                                            setSearchQuery('');
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between group transition-colors border-b border-gray-800 last:border-0 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={coin.image} alt={coin.symbol} className="w-6 h-6 rounded-full" />
                                            <div>
                                                <span className="font-bold text-white block">{coin.symbol.toUpperCase()}</span>
                                                <span className="text-text-muted text-xs block">{coin.name}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                                    </button>
                                ))}
                                {sortedCoins.length === 0 && (
                                    <div className="px-4 py-3 text-text-muted text-sm text-center">No coins found</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`p-3 bg-surface border ${isFilterOpen ? 'border-primary text-primary' : 'border-gray-800 text-text-muted'} rounded-lg hover:border-gray-600 transition-colors hover:text-white cursor-pointer`}
                        >
                            <FaFilter />
                        </button>

                        {isFilterOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-gray-700 rounded-lg shadow-xl z-50 p-2">
                                <h3 className="text-xs font-bold text-text-muted uppercase px-2 py-1 mb-1">Sort By</h3>
                                {[
                                    { label: 'Default', value: 'default' },
                                    { label: 'Price: High to Low', value: 'price-desc' },
                                    { label: 'Price: Low to High', value: 'price-asc' },
                                    { label: 'Top Gainers', value: 'change-desc' },
                                    { label: 'Top Losers', value: 'change-asc' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSortOption(option.value);
                                            setIsFilterOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center justify-between cursor-pointer ${sortOption === option.value ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-gray-300'}`}
                                    >
                                        {option.label}
                                        {sortOption === option.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TopGainers coins={coins} />
                    <TopLosers coins={coins} />
                    <MarketSentiment coins={coins} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 min-h-[500px]">
                        <ChartWidget
                            selectedCoin={selectedCoin}
                            comparisonCoin={comparisonCoin}
                            setComparisonCoin={setComparisonCoin}
                            timeRange={timeRange}
                            setTimeRange={setTimeRange}
                            chartType={chartType}
                            setChartType={setChartType}
                            allCoins={coins} 
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <Watchlist
                            onCoinSelect={handleCoinSelect}
                            selectedCoinId={selectedCoin.id}
                            coins={sortedCoins.slice(0, 10)} 
                        />
                    </div>
                </div>
            </motion.div>
        </Layout>
    );
};

export default Dashboard;

