exports.handler = async function() {
    // Reaches into Netlify settings to get your saved secret key
    const API_KEY = process.env.ODDS_API_KEY; 
    
    // Gets NHL odds from FanDuel & Bet365
    const url = `https://api.the-odds-api.com/v4/sports/icehockey_nhl/odds/?apiKey=${API_KEY}&regions=us,ca&markets=h2h&bookmakers=fanduel,bet365`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};