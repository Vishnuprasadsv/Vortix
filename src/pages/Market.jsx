import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaChevronRight } from 'react-icons/fa';
import { fetchMarkets } from '../services/api';
import { COINS as LOADING_PLACEHOLDER } from '../services/mockData';
import { useDispatch } from 'react-redux';
import { buyAsset } from '../redux/slices/portfolioSlice';
import BuyModal from '../components/BuyModal';
import Loader from '../components/Loader';

const Market = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOption, setSortOption] = useState('default');
    const [expandedCoinId, setExpandedCoinId] = useState(null);

    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [selectedCoinForBuy, setSelectedCoinForBuy] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        const getCoins = async () => {
            try {
                const data = await fetchMarkets();
                setCoins(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load market data", error);
                setCoins(LOADING_PLACEHOLDER);
                setLoading(false);
            }
        };
        getCoins();
    }, []);

    const getSortedCoins = () => {
        let filtered = coins.filter(coin =>
            coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );

        switch (sortOption) {
            case 'price-desc': return filtered.sort((a, b) => b.current_price - a.current_price);
            case 'price-asc': return filtered.sort((a, b) => a.current_price - b.current_price);
            case 'change-desc': return filtered.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
            case 'change-asc': return filtered.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
            case 'mcap-desc': return filtered.sort((a, b) => b.market_cap - a.market_cap);
            case 'mcap-asc': return filtered.sort((a, b) => a.market_cap - b.market_cap);
            default: return filtered;
        }
    };

    const filteredCoins = getSortedCoins();

    const toggleExpand = (id) => {
        setExpandedCoinId(expandedCoinId === id ? null : id);
    };

    const handleBuyClick = (e, coin) => {
        e.stopPropagation();
        setSelectedCoinForBuy(coin);
        setIsBuyModalOpen(true);
    };

    const handleBuyConfirm = (amount) => {
        if (!selectedCoinForBuy) return;
        dispatch(buyAsset({
            id: selectedCoinForBuy.id,
            symbol: selectedCoinForBuy.symbol,
            name: selectedCoinForBuy.name,
            price: selectedCoinForBuy.current_price || selectedCoinForBuy.price,
            amount: amount,
            image: selectedCoinForBuy.image
        }));
        setIsBuyModalOpen(false);
    };



    // ...

    if (loading) {
        return <Loader />;
    }

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search coins..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0F1114] border border-gray-800 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-colors placeholder-gray-600"
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className={`p-3 bg-[#0F1114] border ${filterOpen ? 'border-primary text-primary' : 'border-gray-800 text-gray-400'} rounded-lg hover:border-gray-600 hover:text-white transition-colors cursor-pointer`}
                        >
                            <FaFilter />
                        </button>

                        {filterOpen && (
                            <div className="absolute top-full right-0 mt-2 w-56 bg-surface border border-gray-700 rounded-lg shadow-xl z-50 p-2">
                                <h3 className="text-xs font-bold text-text-muted uppercase px-2 py-1 mb-1">Sort Market</h3>
                                {[
                                    { label: 'Default', value: 'default' },
                                    { label: 'Price: High to Low', value: 'price-desc' },
                                    { label: 'Price: Low to High', value: 'price-asc' },
                                    { label: 'Top Gainers', value: 'change-desc' },
                                    { label: 'Top Losers', value: 'change-asc' },
                                    { label: 'Market Cap: High to Low', value: 'mcap-desc' },
                                    { label: 'Market Cap: Low to High', value: 'mcap-asc' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSortOption(option.value);
                                            setFilterOpen(false);
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

                <div className="bg-[#0F1114] border border-gray-800 rounded-xl overflow-hidden p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-white">Market Overview</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-800">
                                    <th className="pb-4 pl-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-16 hidden md:table-cell">#</th>
                                    <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-wider pl-4 md:pl-0">Coin</th>
                                    <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Price</th>
                                    <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right pr-4 md:pr-0">24H</th>
                                    <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right hidden md:table-cell">M.Cap</th>
                                    <th className="pb-4 pr-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right w-32 hidden md:table-cell">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {filteredCoins.map((coin, index) => (
                                    <React.Fragment key={coin.id}>
                                        <tr
                                            className={`group hover:bg-white/5 transition-colors cursor-pointer ${expandedCoinId === coin.id ? 'bg-white/5' : ''}`}
                                            onClick={() => toggleExpand(coin.id)}
                                        >
                                            <td className="py-4 pl-4 text-gray-500 font-medium text-sm hidden md:table-cell">{index + 1}</td>
                                            <td className="py-4 pl-4 md:pl-0">
                                                <div className="flex items-center gap-3">
                                                    <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                                                    <div>
                                                        <div className="font-bold text-white text-sm">{coin.name}</div>
                                                        <div className="text-gray-500 text-xs font-medium uppercase">{coin.symbol}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-right font-bold text-white text-sm">
                                                ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: coin.current_price < 1 ? 4 : 2 })}
                                            </td>
                                            <td className={`py-4 text-right text-sm font-medium ${(coin.price_change_percentage_24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'} pr-4 md:pr-0`}>
                                                {(coin.price_change_percentage_24h || 0) > 0 ? '+' : ''}{(coin.price_change_percentage_24h || 0).toFixed(2)}%
                                            </td>
                                            <td className="py-4 text-right text-gray-400 text-sm hidden md:table-cell">
                                                ${coin.market_cap.toLocaleString()}
                                            </td>
                                            <td className="py-4 pr-4 text-right hidden md:table-cell">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={(e) => handleBuyClick(e, coin)}
                                                        className="bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer border border-green-500/50"
                                                    >
                                                        Buy
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleExpand(coin.id);
                                                        }}
                                                        className={`p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer ${expandedCoinId === coin.id ? 'text-primary rotate-90' : 'text-gray-500 hover:text-white'}`}
                                                    >
                                                        <FaChevronRight size={12} className="transition-transform duration-200" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedCoinId === coin.id && (
                                            <tr className="bg-white/5 border-b border-gray-800/50">
                                                <td colSpan="6" className="p-0">
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                                        className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden"
                                                    >
                                                        <div>
                                                            <h4 className="text-sm font-bold text-white mb-2">About {coin.name}</h4>
                                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                                {coin.name} ({coin.symbol.toUpperCase()}) is a cryptocurrency with a market cap of ${coin.market_cap.toLocaleString()}.
                                                            </p>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="bg-[#0F1114] p-4 rounded-lg border border-gray-800">
                                                                <div className="text-xs text-text-muted mb-1">Volume (24h)</div>
                                                                <div className="text-white font-medium break-words">${coin.total_volume.toLocaleString()}</div>
                                                            </div>
                                                            <div className="bg-[#0F1114] p-4 rounded-lg border border-gray-800">
                                                                <div className="text-xs text-text-muted mb-1">Circulating Supply</div>
                                                                <div className="text-white font-medium break-words">{coin.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}</div>
                                                            </div>
                                                            <div className="bg-[#0F1114] p-4 rounded-lg border border-gray-800">
                                                                <div className="text-xs text-text-muted mb-1">24h High</div>
                                                                <div className="text-green-500 font-medium break-words">${coin.high_24h}</div>
                                                            </div>
                                                            <div className="bg-[#0F1114] p-4 rounded-lg border border-gray-800">
                                                                <div className="text-xs text-text-muted mb-1">24h Low</div>
                                                                <div className="text-red-500 font-medium break-words">${coin.low_24h}</div>
                                                            </div>
                                                            <div className="bg-[#0F1114] p-4 rounded-lg border border-gray-800 md:hidden col-span-2">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <div className="min-w-0 pr-2">
                                                                        <div className="text-xs text-text-muted mb-1">Market Cap</div>
                                                                        <div className="text-white font-medium break-words">${coin.market_cap.toLocaleString()}</div>
                                                                    </div>
                                                                    <button
                                                                        onClick={(e) => handleBuyClick(e, coin)}
                                                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-lg shadow-green-500/20 shrink-0"
                                                                    >
                                                                        Buy
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            <BuyModal
                isOpen={isBuyModalOpen}
                onClose={() => setIsBuyModalOpen(false)}
                coin={selectedCoinForBuy}
                onBuy={handleBuyConfirm}
            />
        </Layout>
    );
};

export default Market;

