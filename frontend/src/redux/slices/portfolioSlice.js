import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPortfolioAPI, updatePortfolioAPI } from '../../services/api';

const initialState = {
    totalBalance: 0,  
    assets: [],       
    status: 'idle',
    error: null
};

export const fetchPortfolioFromDB = createAsyncThunk(
    'portfolio/fetchPortfolio',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getPortfolioAPI();
            return data.portfolio;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to initialize portfolio from database');
        }
    }
);

export const savePortfolioToDB = createAsyncThunk(
    'portfolio/savePortfolio',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { portfolio } = getState();

            const dataToSave = {
                totalBalance: portfolio.totalBalance,
                assets: portfolio.assets
            };

            const data = await updatePortfolioAPI(dataToSave);
            return data.portfolio;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to save portfolio to database');
        }
    }
);

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        setPortfolio: (state, action) => {
            state.totalBalance = action.payload.totalBalance;
            state.assets = action.payload.assets || [];
        },
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
            } else {
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
        },
        updatePortfolioPrices: (state, action) => {
            const currentPrices = action.payload;
            state.assets.forEach(asset => {
                if (currentPrices[asset.id]) {
                    asset.value = asset.amount * currentPrices[asset.id];
                }
            });
        },
        sellAsset: (state, action) => {
            const { id, amount, price } = action.payload;
            const assetIndex = state.assets.findIndex(a => a.id === id);

            if (assetIndex !== -1) {
                const asset = state.assets[assetIndex];
                const saleValue = amount * price;

                asset.amount -= amount;
                asset.value = asset.amount * price;

                state.totalBalance += saleValue;

                if (asset.amount <= 0) {
                    state.assets.splice(assetIndex, 1);
                }
            }
        },
        withdrawFunds: (state, action) => {
            const amount = action.payload;
            state.totalBalance = Math.max(0, state.totalBalance - amount);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPortfolioFromDB.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPortfolioFromDB.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.totalBalance = action.payload.totalBalance || 0;
                state.assets = action.payload.assets || [];
            })
            .addCase(fetchPortfolioFromDB.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { buyAsset, updatePortfolioPrices, sellAsset, withdrawFunds, setPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
