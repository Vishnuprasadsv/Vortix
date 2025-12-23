import { useState, useEffect } from 'react';
import {
    AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar
} from 'recharts';
import { FaExchangeAlt, FaChartBar, FaChartLine, FaChartArea } from 'react-icons/fa';
import { getCoinData } from '../services/mockData';

import { useDispatch } from 'react-redux';
import { buyAsset } from '../redux/slices/portfolioSlice';
import BuyModal from './BuyModal';

const ChartWidget = ({ selectedCoin, comparisonCoin, setComparisonCoin, timeRange, setTimeRange, chartType, setChartType, allCoins = [] }) => {
    const [chartData, setChartData] = useState([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!selectedCoin) return;

        const currentPrice = selectedCoin.current_price || selectedCoin.price || 100;
        const primaryData = getCoinData(selectedCoin.id, timeRange, currentPrice);

        if (comparisonCoin) {
            const compPrice = comparisonCoin.current_price || comparisonCoin.price || 100;
            const secondaryData = getCoinData(comparisonCoin.id, timeRange, compPrice);
            const merged = primaryData.map((point, i) => ({
                ...point,
                price2: secondaryData[i]?.price
            }));
            setChartData(merged);
        } else {
            setChartData(primaryData);
        }
    }, [selectedCoin, comparisonCoin, timeRange]);

    const handleBuy = (amount) => {
        dispatch(buyAsset({
            id: selectedCoin.id,
            symbol: selectedCoin.symbol,
            name: selectedCoin.name,
            price: selectedCoin.current_price || selectedCoin.price,
            amount: amount,
            image: selectedCoin.image,
        }));
    };

    const formatXAxis = (tick) => {
        const date = new Date(tick);
        if (timeRange === '24H') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const getCoinColor = (coin) => coin?.color || '#22c55e'; 

    const renderChart = () => {
        const primaryColor = '#FF5F1F'; 
        const secondaryColor = '#ef4444'; 

        const commonProps = {
            data: chartData,
            margin: { top: 10, right: 0, left: 0, bottom: 0 }
        };

        const renderComparisonSeries = () => {
            if (!comparisonCoin) return null;
            if (chartType === 'area') {
                return (
                    <Area yAxisId="right" type="monotone" dataKey="price2" name={comparisonCoin.name} stroke={secondaryColor} fill={`url(#colorPrice2)`} strokeWidth={2} strokeDasharray="5 5" />
                );
            }
            return (
                <Line yAxisId="right" type="monotone" dataKey="price2" name={comparisonCoin.name} stroke={secondaryColor} strokeWidth={2} dot={false} strokeDasharray="5 5" />
            );
        };

        const ComparisonAndDefs = () => (
            <>
                <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                    </linearGradient>
                    {comparisonCoin && (
                        <linearGradient id="colorPrice2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
                        </linearGradient>
                    )}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis
                    dataKey="time"
                    stroke="#666"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatXAxis}
                    interval={timeRange === '24H' ? 2 : 'preserveStartEnd'}
                />
                <YAxis yAxisId="left" stroke="#666" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                {comparisonCoin && (
                    <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                )}
                <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#fff' }}
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                />
            </>
        );

        if (chartType === 'line') {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart {...commonProps}>
                        <ComparisonAndDefs />
                        <Line yAxisId="left" type="monotone" dataKey="price" stroke={primaryColor} strokeWidth={2} dot={false} />
                        {renderComparisonSeries()}
                    </ComposedChart>
                </ResponsiveContainer>
            );
        }

        if (chartType === 'candle') {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart {...commonProps}>
                        <ComparisonAndDefs />
                        <Bar yAxisId="left" dataKey="price" fill={primaryColor} barSize={10} radius={[2, 2, 0, 0]} />
                        <Line yAxisId="left" type="monotone" dataKey="price" stroke="#fff" strokeWidth={1} dot={false} alpha={0.5} />
                        {renderComparisonSeries()}
                    </ComposedChart>
                </ResponsiveContainer>
            );
        }

        // Default to Area
        return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart {...commonProps}>
                    <ComparisonAndDefs />
                    <Area yAxisId="left" type="monotone" dataKey="price" stroke={primaryColor} strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                    {renderComparisonSeries()}
                </AreaChart>
            </ResponsiveContainer>
        );
    };

    if (!selectedCoin) return <div className="text-white">Select a coin to view chart</div>;

    return (
        <div className="bg-surface rounded-xl border border-gray-800 p-6 flex flex-col h-full relative">
            {/* Header */}
            <div className="flex flex-row items-center justify-between gap-4 mb-6 min-w-0">
                <div className="flex flex-row items-center gap-6 flex-1 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                        {selectedCoin.image && <img src={selectedCoin.image} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />}
                        <div className="flex items-baseline gap-2 min-w-0 overflow-hidden">
                            <h2 className="text-xl font-bold text-white truncate">
                                {selectedCoin.name}
                            </h2>
                        </div>
                        <span className="text-green-500 font-bold text-lg whitespace-nowrap">
                            ${(selectedCoin.current_price || selectedCoin.price || 0).toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={() => setIsBuyModalOpen(true)}
                            className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold py-1.5 px-6 rounded transition-colors text-sm cursor-pointer whitespace-nowrap"
                        >
                            Buy
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setIsCompareModalOpen(!isCompareModalOpen)}
                                className={`border ${comparisonCoin ? 'border-primary text-primary' : 'border-gray-800 text-gray-400'} hover:border-gray-600 hover:text-white font-medium py-1.5 px-4 rounded transition-colors flex items-center gap-2 text-sm whitespace-nowrap cursor-pointer bg-transparent`}
                            >
                                <FaExchangeAlt /> {comparisonCoin ? `vs ${comparisonCoin.symbol.toUpperCase()}` : 'Compare'}
                            </button>

                            {isCompareModalOpen && (
                                <div className="absolute top-full left-0 mt-2 bg-surface border border-gray-700 rounded-lg shadow-xl w-56 z-50 flex flex-col overflow-hidden">
                                    <div className="p-2 pb-0">
                                        <h3 className="text-xs text-text-muted uppercase mb-2 px-2">Select Coin</h3>
                                    </div>
                                    <div className="overflow-y-auto custom-scrollbar max-h-60 p-2 pt-0">
                                        {allCoins.filter(c => c.id !== selectedCoin.id).map(coin => (
                                            <button
                                                key={coin.id}
                                                onClick={() => {
                                                    setComparisonCoin(coin);
                                                    setIsCompareModalOpen(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-800 rounded flex items-center justify-between group cursor-pointer"
                                            >
                                                <span className="group-hover:text-white text-gray-300">{coin.name}</span>
                                                {comparisonCoin?.id === coin.id && <span className="text-primary text-xs">Active</span>}
                                            </button>
                                        ))}
                                    </div>
                                    {comparisonCoin && (
                                        <div className="p-2 border-t border-gray-800 bg-surface">
                                            <button
                                                onClick={() => {
                                                    setComparisonCoin(null);
                                                    setIsCompareModalOpen(false);
                                                }}
                                                className="w-full text-center px-3 py-2 text-sm hover:bg-red-500/10 text-red-500 rounded cursor-pointer transition-colors font-medium"
                                            >
                                                Clear Comparison
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-4 flex-shrink-0">
                    <div className="bg-black/40 rounded-lg p-1 flex items-center gap-1">
                        {['24H', '7D', '30D'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setTimeRange(tab)}
                                className={`px-3 py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${timeRange === tab ? 'bg-[#FF5F1F] text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1">
                        <button
                            onClick={() => setChartType('area')}
                            className={`p-2 rounded cursor-pointer ${chartType === 'area' ? 'bg-[#FF5F1F] text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            <FaChartArea size={14} />
                        </button>
                        <button
                            onClick={() => setChartType('line')}
                            className={`p-2 rounded cursor-pointer ${chartType === 'line' ? 'bg-[#FF5F1F] text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            <FaChartLine size={14} />
                        </button>
                        <button
                            onClick={() => setChartType('candle')}
                            className={`p-2 rounded cursor-pointer ${chartType === 'candle' ? 'bg-[#FF5F1F] text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            <FaChartBar size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="h-[400px] w-full mt-auto">
                {renderChart()}
            </div>

            <BuyModal
                isOpen={isBuyModalOpen}
                onClose={() => setIsBuyModalOpen(false)}
                coin={selectedCoin}
                onBuy={handleBuy}
            />
        </div>
    );
};

export default ChartWidget;



