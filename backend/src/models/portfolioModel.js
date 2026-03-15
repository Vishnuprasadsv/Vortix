import mongoose, { Schema } from "mongoose";

// Sub-schema specifically for defining what each crypto asset looks like
const assetSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    avgPrice: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    color: {
        type: String
    }
});

// Define the schema for user portfolios
const portfolioSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user', // Link this to the 'user' model
        required: true,
        unique: true // Ensure one portfolio per user
    },
    totalBalance: {
        type: Number,
        default: 100000 // Users start with $100,000 play money
    },
    assets: [assetSchema] // Array of assetSchema items
},
    { timestamps: true }
);

// Export the portfolio model
export default mongoose.model('portfolio', portfolioSchema);
