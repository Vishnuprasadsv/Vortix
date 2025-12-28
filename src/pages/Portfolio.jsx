import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { FaWallet, FaBitcoin, FaEthereum } from "react-icons/fa";
import Button from "../components/Button";
import { useSelector, useDispatch } from "react-redux";
import {
  updatePortfolioPrices,
  sellAsset,
} from "../redux/slices/portfolioSlice";
import { COINS } from "../services/mockData";
import SellModal from "../components/SellModal";
import WithdrawModal from "../components/WithdrawModal";

const getIcon = (symbol, color) => {
  switch (symbol) {
    case "BTC":
      return <FaBitcoin className="text-orange-500 text-2xl" />;
    case "ETH":
      return <FaEthereum className="text-blue-500 text-2xl" />;
    default:
      return (
        <div className="font-bold text-lg" style={{ color: color }}>
          {symbol?.charAt(0)}
        </div>
      );
  }
};

const Portfolio = () => {
  const { totalBalance, assets } = useSelector((state) => state.portfolio);
  const dispatch = useDispatch();
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  useEffect(() => {
    const prices = {};
    COINS.forEach((c) => (prices[c.id] = c.price));
    dispatch(updatePortfolioPrices(prices));
  }, [dispatch]);

  const handleSellClick = (asset) => {
    setSelectedAsset(asset);
    setIsSellModalOpen(true);
  };

  const handleConfirmSell = (amount) => {
    if (!selectedAsset) return;
    const currentPrice = selectedAsset.value / selectedAsset.amount;

    dispatch(
      sellAsset({
        id: selectedAsset.id,
        amount: amount,
        price: currentPrice,
      })
    );
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <div className="bg-[#0F1114] border border-gray-800 rounded-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaWallet className="text-orange-500 text-2xl" />
                <h1 className="text-2xl font-bold text-white">My Portfolio</h1>
              </div>
              <p className="text-gray-400">Track and manage your assets</p>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
              <div className="bg-black/40 border border-gray-800 rounded-lg px-6 py-3 text-center md:text-left">
                <div className="text-xs text-center text-gray-500 font-bold uppercase tracking-wider mb-1">
                  Total Balance
                </div>
                <div className="text-2xl font-bold text-white tracking-wide">
                  $
                  {totalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                  })}
                </div>
              </div>
              <Button
                variant="primary"
                onClick={() => setIsWithdrawModalOpen(true)}
                className="bg-green-500 hover:bg-green-600 border-none text-white py-3 md:py-4 px-6 h-auto md:h-[74px] flex justify-center items-center text-sm md:text-base w-full md:w-auto shadow-lg shadow-green-500/20 font-bold transition-all"
              >
                <FaWallet className="mr-2" /> Withdraw Funds
              </Button>
            </div>
          </div>
        </div>

        {assets.length === 0 ? (
          <div className="bg-[#0F1114] border border-gray-800 border-dashed rounded-xl p-12 min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center mb-4 text-gray-600">
              <FaWallet className="text-3xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-400">
              No assets found in your portfolio.
            </h3>
          </div>
        ) : (
          <div className="bg-[#0F1114] border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Your Assets</h2>
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-800 bg-white/5">
                    <th className="py-4 pl-6 text-xs font-bold text-gray-500 uppercase">
                      Asset
                    </th>
                    <th className="py-4 text-xs font-bold text-gray-500 uppercase text-right">
                      Balance
                    </th>
                    <th className="py-4 text-xs font-bold text-gray-500 uppercase text-right">
                      Avg. Price
                    </th>
                    <th className="py-4 text-xs font-bold text-gray-500 uppercase text-right">
                      Value
                    </th>
                    <th className="py-4 pr-6 text-xs font-bold text-gray-500 uppercase text-right w-24">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {assets.map((asset) => (
                    <tr
                      key={asset.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                            {getIcon(asset.symbol, asset.color)}
                          </div>
                          <div>
                            <div className="font-bold text-white">
                              {asset.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {asset.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right font-medium text-white">
                        {asset.amount.toLocaleString()} {asset.symbol}
                      </td>
                      <td className="py-4 text-right text-gray-400">
                        $
                        {asset.avgPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-4 text-right font-bold text-green-500">
                        $
                        {asset.value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <button
                          onClick={() => handleSellClick(asset)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold py-1.5 px-3 rounded transition-colors border border-red-500/50 cursor-pointer"
                        >
                          Sell
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden flex flex-col divide-y divide-gray-800">
              {assets.map((asset) => (
                <div key={asset.id} className="p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        {getIcon(asset.symbol, asset.color)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{asset.name}</div>
                        <div className="text-xs text-gray-500">
                          {asset.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-500 text-lg">
                        $
                        {asset.value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {asset.amount.toLocaleString()} {asset.symbol}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-gray-800/50">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 uppercase">
                        Avg. Price
                      </span>
                      <span className="text-sm font-medium text-gray-300">
                        $
                        {asset.avgPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => handleSellClick(asset)}
                      className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer border border-red-500/50"
                    >
                      Sell Asset
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <SellModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        asset={selectedAsset}
        onSell={handleConfirmSell}
      />

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        totalBalance={totalBalance}
      />
    </Layout>
  );
};

export default Portfolio;
