const User = require('../models/userModel');

const isCompatible = (seeker, provider) => {

    return seeker.personalitytype === provider.personalitytype &&
           Math.abs(seeker.personalityscore - provider.personalityscore) <= 2;
};

// Maximum Bipartite Matching Algorithm 
const bpm = (u, graph, seen, matchR) => {
    for (let v = 0; v < graph[0].length; v++) {
        if (graph[u][v] && !seen[v]) {
            seen[v] = true;
            if (matchR[v] < 0 || bpm(matchR[v], graph, seen, matchR)) {
                matchR[v] = u;
                return true;
            }
        }
    }
    return false;
};

exports.searchUsers = async (req, res) => {
    try {
        const seeker = await User.findById(req.user.id);
        if (!seeker) {
            return res.status(404).json({
                success: false,
                message: "Requester not found."
            });
        }

    
        const providers = await User.find({ _id: { $ne: seeker._id } });
        if (providers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No providers available for matching."
            });
        }
        const graph = [providers.map(provider => isCompatible(seeker, provider) ? 1 : 0)];
        const matchR = Array(providers.length).fill(-1);
        let result = 0;
        const seen = Array(providers.length).fill(false);
        if (bpm(0, graph, seen, matchR)) {
            result++;
        }

        const matches = [];
        matchR.forEach((seekerIdx, providerIdx) => {
            if (seekerIdx !== -1) {
                matches.push({
                    seeker: seeker,
                    provider: providers[providerIdx],
                });
            }
        });

        return res.status(200).json({
            success: true,
            matches,
        });
    } catch (error) {
        console.error("Error during matching:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while searching for users.",
            error: error.message,
        });
    }
};
