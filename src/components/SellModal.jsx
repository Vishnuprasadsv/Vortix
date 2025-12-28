import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import Button from "./Button";

const getIcon = (symbol, color) => {
  switch (symbol) {
    case "BTC":
      return <FaBitcoin className="text-orange-500 text-3xl" />;
    case "ETH":
      return <FaEthereum className="text-blue-500 text-3xl" />;
    default:
      return (
        <div className="font-bold text-2xl" style={{ color: color }}>
          {symbol?.charAt(0)}
        </div>
      );
  }
};

const SellModal = ({ isOpen, onClose, asset, onSell }) => {
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setTotal(0);
      setLoading(false);
    }
  }, [isOpen]);

  const calculateTotal = (val) => {
    const numVal = parseFloat(val);
    if (isNaN(numVal)) {
      setTotal(0);
    } else {
      const currentPrice = asset.amount > 0 ? asset.value / asset.amount : 0;
      setTotal(numVal * currentPrice);
    }
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (isNaN(val) && val !== ".") return;

    setAmount(val);
    calculateTotal(val);
  };

  const handleMax = () => {
    if (!asset) return;
    const maxAmount = asset.amount;
    setAmount(maxAmount.toString());
    calculateTotal(maxAmount);
  };

  const handleSell = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    if (parseFloat(amount) > asset.amount) {
      alert("Insufficient balance");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onSell(parseFloat(amount));
      onClose();
      setLoading(false);
    }, 3000);
  };

  if (!isOpen || !asset) return null;

  const currentPrice = asset.amount > 0 ? asset.value / asset.amount : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!loading ? onClose : undefined}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-[#0F1114] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 pb-2 text-center relative">
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-red-500 mb-1">Sell Asset</h2>
            <p className="text-gray-400 text-sm">Selling {asset.name}</p>
          </div>

          <div className="p-6 pt-2 space-y-6">
            <div className="bg-[#16191E] border border-gray-800 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
                {getIcon(asset.symbol, asset.color)}
              </div>
              <div>
                <div className="font-bold text-white text-lg">
                  {asset.symbol}
                </div>
                <div className="text-gray-500 text-sm">
                  $
                  {currentPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-400">
                Amount ({asset.symbol})
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  disabled={loading}
                  placeholder="0.00"
                  className="w-full bg-black/40 border border-gray-800 rounded-lg p-4 pr-16 text-xl font-mono text-white focus:outline-none focus:border-red-500 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={handleMax}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold bg-[#1E2329] text-red-500 hover:bg-[#2A3038] px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  MAX
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Available: {asset.amount.toLocaleString()} {asset.symbol}
              </div>
            </div>

            <div className="h-px bg-gray-800" />

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Estimated Total</span>
              <span className="text-xl font-bold text-white">
                $
                {total.toLocaleString(undefined, {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4,
                })}
              </span>
            </div>

            <Button
              variant="danger"
              onClick={handleSell}
              isLoading={loading}
              className="w-full py-4 text-base border-none flex items-center justify-center gap-2 group"
            >
              {loading ? (
                "Selling..."
              ) : (
                <>
                  Sell Now{" "}
                  <ExternalLink
                    size={16}
                    className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
                  />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SellModal;
