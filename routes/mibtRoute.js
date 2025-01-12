// routes/mbtiRoutes.js
import express from 'express'; // Using ES Module import
import { personalityController} from '../controllers/personalityController.js'; // Importing the functions from controller
import authMiddleware from './middleware/authUser.js'; // Import authMiddleware using ES Module
import MBTIAnalysis from '../models/data.js';// Assuming MBTIAnalysis model exists

const router=express.Router();
router.post('/analyze', authMiddleware, personalityController.analyzePersonality);

router.get('/analysis/:id', authMiddleware, personalityController.getAnalysisById);

router.get('/my-analyses', authMiddleware, async (req, res) => {
    try {
        const analyses = await MBTIAnalysis.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        // Render the EJS template and pass the data to it
        res.render('analysis', { analyses });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch analyses',
            details: error.message
        });
    }
});

export default router;
