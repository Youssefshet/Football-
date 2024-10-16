async function fetchApiData(endpoint) {
    const apiUrl = `https://api.football-data.org/v4/${endpoint}`;
    const apiKey = "3a5ed55400f94400ac3acb79fb88bafc";

    try {
        const response = await fetch(apiUrl, {
            headers: { "X-Auth-Token": apiKey }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
    if (sectionId === 'matches') fetchMatches();
    if (sectionId === 'standings') fetchStandings();
    if (sectionId === 'top-scorers') fetchTopScorers();
    if (sectionId === 'competitions') fetchCompetitions();
}

async function fetchMatches() {
    const matches = await fetchApiData(`matches?status=SCHEDULED`);
    const container = document.getElementById("matches-container");
    container.innerHTML = matches ? displayMatches(matches.matches) : "<p>No matches available.</p>";
}

function displayMatches(matches) {
    return matches.map(match => `
        <div class="match">
            <span class="team">${match.homeTeam.name}</span> vs <span class="team">${match.awayTeam.name}</span>
            <span> - ${match.utcDate.split('T')[0]}</span>
        </div>
    `).join('');
}

async function fetchStandings() {
    const standings = await fetchApiData("competitions/PL/standings");
    const container = document.getElementById("standings-container");
    container.innerHTML = standings ? displayStandings(standings.standings[0].table) : "<p>No standings available.</p>";
}

function displayStandings(teams) {
    return teams.map(team => `
        <div class="team">
            <span>${team.position}. ${team.team.name}</span> - <span>${team.points} Points</span>
        </div>
    `).join('');
}

async function fetchTopScorers() {
    const scorers = await fetchApiData("competitions/PL/scorers");
    const container = document.getElementById("top-scorers-container");
    container.innerHTML = scorers ? displayTopScorers(scorers.scorers) : "<p>No top scorers available.</p>";
}

function displayTopScorers(scorers) {
    return scorers.map(scorer => `
        <div class="scorer">
            <span>${scorer.player.name} - ${scorer.team.name}</span> - <span>${scorer.goals} Goals</span>
        </div>
    `).join('');
}

async function fetchCompetitions() {
    const competitions = await fetchApiData("competitions");
    const container = document.getElementById("competitions-container");
    container.innerHTML = competitions ? displayCompetitions(competitions.competitions) : "<p>No competitions available.</p>";
}

function displayCompetitions(comp) {
    return comp.map(competition => `
        <div class="competition">
            <span>${competition.name}</span> - <span>${competition.area.name}</span>
        </div>
    `).join('');
}

window.onload = () => showSection('matches');