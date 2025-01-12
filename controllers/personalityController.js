
import express from 'express';
import { spawn } from 'child_process';
import MBTIAnalysis from '../models/data.js';

const validateScores = (scores) => {
    return Array.isArray(scores) && 
           scores.length === 4 && 
           scores.every(score => typeof score === 'number');
};


const analyzePersonality = async (req, res) => {
    console.log(req.user);
    const {scores} = req.body;
    const userId = req.user.userId;
    console.log(req.body);
    if (!validateScores(scores)) {
        return res.status(400).json({
           
            error: 'Invalid input: Expected array of 4 numeric scores'
        });
    }

    try {
        const pythonResult = await runPythonAnalysis(scores);
        
        const formattedResult = formatAnalysisResult(pythonResult);

        const mbtiAnalysis = new MBTIAnalysis({
            userId,
            type: formattedResult.type,
            overallPersonalityScore: formattedResult.overallScore,
            preferenceAlignment: formattedResult.preferenceAlignment,
            dominantTraits: {
                organization: formattedResult.traits.organization,
                reliability: formattedResult.traits.reliability,
                analysis: formattedResult.traits.analysis,
                logic: formattedResult.traits.logic
            },
            preferenceBreakdown: {
                EI: formattedResult.preferences.EI.preference,
                EIPercentage: formattedResult.preferences.EI.percentage,
                SN: formattedResult.preferences.SN.preference,
                SNPercentage: formattedResult.preferences.SN.percentage,
                TF: formattedResult.preferences.TF.preference,
                TFPercentage: formattedResult.preferences.TF.percentage,
                JP: formattedResult.preferences.JP.preference,
                JPPercentage: formattedResult.preferences.JP.percentage
            },
            traitDevelopmentScores: {
                organization: formattedResult.development.organization,
                detail: formattedResult.development.detail,
                logic: formattedResult.development.logic,
                reliability: formattedResult.development.reliability,
                analysis: formattedResult.development.analysis,
                innovation: formattedResult.development.innovation,
                adaptability: formattedResult.development.adaptability
            },
            cognitiveFunctions: formattedResult.cognitiveFunctions
        });
        await mbtiAnalysis.save();
        res.json({
            analysisId: mbtiAnalysis._id,
            result: mbtiAnalysis
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(error.status || 500).json({
            error: error.message || 'Internal server error',
            details: error.details
        });
    }
};

const runPythonAnalysis = (scores) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['mbti_predictor.py', ...scores.map(String)]);
        
        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        const timeout = setTimeout(() => {
            pythonProcess.kill();
            reject({
                status: 504,
                message: 'Process timed out'
            });
        }, 30000);

        pythonProcess.on('close', (code) => {
            clearTimeout(timeout);
            
            if (code !== 0) {
                reject({
                    status: 500,
                    message: 'Python script execution failed',
                    details: error || `Process exited with code ${code}`
                });
                return;
            }

            try {
                const trimmedResult = result.trim();
                if (!trimmedResult) {
                    throw new Error('Empty result from Python script');
                }
                
                resolve(trimmedResult);
            } catch (e) {
                reject({
                    status: 500,
                    message: 'Failed to parse results',
                    details: e.message
                });
            }
        });

        pythonProcess.on('error', (err) => {
            clearTimeout(timeout);
            reject({
                status: 500,
                message: 'Failed to start Python process',
                details: err.message
            });
        });
    });
};

// Helper function to format Python output according to schema
const formatAnalysisResult = (result) => {
    try {
        const data = JSON.parse(result);
        
        // Convert raw scores to preference strings
        const getPreference = (score, options) => {
            return {
                preference: score > 50 ? options[0] : options[1],
                percentage: Math.abs(score - 50) * 2  // Convert to percentage
            };
        };

        return {
            type: data.type,
            overallScore: data.overallScore,
            preferenceAlignment: data.alignmentScore,
            traits: {
                organization: data.dominantTraits.organization,
                reliability: data.dominantTraits.reliability,
                analysis: data.dominantTraits.analysis,
                logic: data.dominantTraits.logic
            },
            preferences: {
                EI: getPreference(data.scores.EI, ['Extraversion', 'Introversion']),
                SN: getPreference(data.scores.SN, ['Sensing', 'Intuition']),
                TF: getPreference(data.scores.TF, ['Thinking', 'Feeling']),
                JP: getPreference(data.scores.JP, ['Judging', 'Perceiving'])
            },
            development: {
                organization: data.development.organization,
                detail: data.development.detail,
                logic: data.development.logic,
                reliability: data.development.reliability,
                analysis: data.development.analysis,
                innovation: data.development.innovation,
                adaptability: data.development.adaptability
            },
            cognitiveFunctions: data.cognitiveFunctions
        };
    } catch (error) {
        throw new Error('Failed to parse Python script output');
    }
};

// Get analysis by ID
const getAnalysisById = async (req, res) => {
    try {
        const analysis = await MBTIAnalysis.findById(req.params.id);
        if (!analysis) {
            return res.status(404).json({ error: 'Analysis not found' });
        }
        res.json(analysis);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch analysis',
            details: error.message
        });
    }
};

// expot const = {
//     analyzePersonality,
//     getAnalysisById
// };

export const personalityController = {
    analyzePersonality,getAnalysisById
  };
  