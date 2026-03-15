import portfolioModel from "../models/portfolioModel.js";

// Fetch the user's portfolio data
export const getPortfolio = async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from the token

        // Look for existing portfolio
        let portfolio = await portfolioModel.findOne({ user: userId });

        // If no portfolio exists, create a default one with 0 balance
        if (!portfolio) {
            portfolio = await portfolioModel.create({
                user: userId,
                totalBalance: 0,
                assets: []
            });
        }

        res.status(200).json({ portfolio });
    } catch (error) {
        console.error("Error getting portfolio:", error.message);
        res.status(500).json({ msg: "Error retrieving portfolio", error: error.message });
    }
};

// Update the user's portfolio with new balance and assets
export const updatePortfolio = async (req, res) => {
    try {
        const userId = req.user._id;
        const { totalBalance, assets } = req.body; // Details sent from the frontend

        // Update existing or insert a new portfolio object
        const updatedPortfolio = await portfolioModel.findOneAndUpdate(
            { user: userId },
            {
                $set: {
                    totalBalance: totalBalance,
                    assets: assets
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ msg: "Portfolio updated successfully", portfolio: updatedPortfolio });
    } catch (error) {
        console.error("Error updating portfolio:", error.message);
        res.status(500).json({ msg: "Error updating portfolio", error: error.message });
    }
};
