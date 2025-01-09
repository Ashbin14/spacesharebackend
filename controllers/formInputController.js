const User = require('../models/userModel');
const FormInput = require('../models/formInputModel');
const axios = require('axios'); // For ML API requests


exports.calculatePersonality = async (req, res) => {
    const { userId, formData } = req.body;

    if (!userId || !formData) {
        return res.status(400).json({
            success: false,
            message: "User ID and form input data are required."
        });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

       
        const mlModelUrl = "http://example-ml-model.com/predict"; // Replace with your actual ML model endpoint
        const response = await axios.post(mlModelUrl, { formData });

        const { personalityScore, personalityType } = response.data;

        if (!personalityScore || !personalityType) {
            return res.status(500).json({
                success: false,
                message: "Failed to calculate personality score and type."
            });
        }

        // Store the form input data in the database
        const formInput = new FormInput({
            userId,
            formData
        });
        await formInput.save();


        user.personalityscore = personalityScore;
        user.personalitytype = personalityType;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Personality score and type calculated successfully.",
            data: {
                personalityScore,
                personalityType
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing the request.",
            error: error.message
        });
    }
};
