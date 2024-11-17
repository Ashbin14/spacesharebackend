const User = require('../models/userModel');
const Post = require('../models/flatModel');

exports.getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
      
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const posts = await Post.find({ userId });// Sort garney according to the post created 

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully.",
            data: {
                user,
                posts
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the profile.",
            error: error.message
        });
    }
};
