exports.handler = async function(event, context) {
    const API_KEY = process.env.ODDS_API_KEY; 
    
    // Grab sport key and date from query parameters (default to NHL if not sent)
    const sport = event.queryStringParameters.sport || 'icehockey_nhl';
    const selectedDate = event.queryStringParameters.date; // Format: YYYY-MM-DD

    let url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${API_KEY}&regions=us,ca&markets=h2h&bookmakers=fanduel,bet365`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return { statusCode: response.status, body: JSON.stringify({ error: response.statusText }) };
        }
        
        let data = await response.json();

        // Filter games by date if selected
        if (selectedDate && Array.isArray(data)) {
            data = data.filter(game => {
                // Convert game UTC time to EST (America/New_York)
                const gameEstDate = new Date(game.commence_time).toLocaleDateString("en-CA", {
                    timeZone: "America/New_York"
                });
                return gameEstDate === selectedDate;
            });
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
