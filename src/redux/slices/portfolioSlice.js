import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    totalBalance: 0,
    assets: [], 
};

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        buyAsset: (state, action) => {
            const { id, symbol, name, amount, price } = action.payload;
            const cost = amount * price;

            const existingAsset = state.assets.find(asset => asset.id === id);

            if (existingAsset) {
                const totalValue = (existingAsset.amount * existingAsset.avgPrice) + cost;
                const newAmount = existingAsset.amount + amount;

                existingAsset.amount = newAmount;
                existingAsset.avgPrice = totalValue / newAmount;
                existingAsset.value = newAmount * price; 
                state.assets.push({
                    id,
                    symbol,
                    name,
                    amount,
                    avgPrice: price,
                    value: cost,
                    color: action.payload.color 
                });
            }


            state.totalBalance += cost;
        },
        updatePortfolioPrices: (state, action) => {
            const currentPrices = action.payload; 
            let newTotal = 0;
            state.assets.forEach(asset => {
                if (currentPrices[asset.id]) {
                    asset.value = asset.amount * currentPrices[asset.id];
                }
                newTotal += asset.value;
            });
            state.totalBalance = newTotal;
        },
        sellAsset: (state, action) => {
            const { id, amount, price } = action.payload;
            const assetIndex = state.assets.findIndex(a => a.id === id);

            if (assetIndex !== -1) {
                const asset = state.assets[assetIndex];
                const saleValue = amount * price;

                asset.amount -= amount;
                asset.value = asset.amount * price; 

                state.totalBalance -= saleValue;

                if (asset.amount <= 0) {
                    state.assets.splice(assetIndex, 1);
                }
            }
        }
    }
});

export const { buyAsset, updatePortfolioPrices, sellAsset } = portfolioSlice.actions;
export default portfolioSlice.reducer;
