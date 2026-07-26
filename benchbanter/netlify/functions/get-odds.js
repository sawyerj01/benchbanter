exports.handler = async function(event, context) {
    const API_KEY = process.env.ODDS_API_KEY; 
    
    const sport = event.queryStringParameters.sport || 'icehockey_nhl';
    const selectedDate = event.queryStringParameters.date; // YYYY-MM-DD

    // Uses the scores endpoint to pull live scores, game progress, and odds together
    let url = `https://api.the-odds-api.com/v4/sports/${sport}/scores/?apiKey=${API_KEY}&daysFrom=1&dateFormat=iso`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return { statusCode: response.status, body: JSON.stringify({ error: response.statusText }) };
        }
        
        let data = await response.json();

        // Filter games by EST date if provided
        if (selectedDate && Array.isArray(data)) {
            data = data.filter(game => {
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
