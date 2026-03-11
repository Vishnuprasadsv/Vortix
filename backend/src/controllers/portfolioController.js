import portfolioModel from "../models/portfolioModel.js";

export const getPortfolio = async (req, res) => {
    try {
        const userId = req.user._id;

        let portfolio = await portfolioModel.findOne({ user: userId });

        if (!portfolio) {
            portfolio = await portfolioModel.create({
                user: userId,
                totalBalance: 100000, 
                assets: []
            });
        }

        res.status(200).json({ portfolio });
    } catch (error) {
        console.error("Error getting portfolio:", error.message);
        res.status(500).json({ msg: "Error retrieving portfolio", error: error.message });
    }
};

export const updatePortfolio = async (req, res) => {
    try {
        const userId = req.user._id;
        const { totalBalance, assets } = req.body;

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
