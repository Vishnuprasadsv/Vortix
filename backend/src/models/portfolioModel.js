import mongoose, { Schema } from "mongoose";

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

const portfolioSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    totalBalance: {
        type: Number,
        default: 100000 
    },
    assets: [assetSchema]
},
    { timestamps: true }
);

export default mongoose.model('portfolio', portfolioSchema);
