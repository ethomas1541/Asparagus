const axios = require('axios');
const http = require('http');
const https = require('https');

const API_KEY = 'fefac935-f11a-4342-87fc-59e8ee37995e';
const BASE_URL = 'https://api4.thetvdb.com/v4';

async function getAuthToken(apiKey) {
    const url = `${BASE_URL}/login`;
    const payload = { apikey: apiKey };
    const headers = { 'Content-Type': 'application/json' };

    try {
        const response = await axios.post(url, payload, { headers });
        if (response.data && response.data.data && response.data.data.token) {
            return response.data.data.token;
        } else {
            throw new Error("Authentication failed: 'token' not found in the response");
        }
    } catch (error) {
        console.error("Authentication error:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function searchSeries(token, seriesName) {
    const url = `${BASE_URL}/search?query=${encodeURIComponent(seriesName)}`;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error("Search series error:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function getSeriesInfo(token, seriesId) {
    const url = `${BASE_URL}/series/${seriesId}`;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error("Get series info error:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function displayThumbnail(imageUrl) {
    const protocol = imageUrl.startsWith('https') ? https : http;

    protocol.get(imageUrl, (response) => {
        response.setEncoding('base64');
        let body = 'data:' + response.headers['content-type'] + ';base64,';
        response.on('data', (data) => body += data);
        response.on('end', () => {
            console.log(`Thumbnail URL: ${imageUrl}`);
            //console.log(body);
        });
    }).on('error', (e) => {
        console.error(`Error fetching image: ${e.message}`);
    });
}

async function main() {
    try {
        const token = await getAuthToken(API_KEY);
        const seriesName = 'South Park';
        const searchResults = await searchSeries(token, seriesName);

        if (searchResults.data && searchResults.data.length > 0) {
            const firstResult = searchResults.data[0];
            const seriesId = firstResult.tvdb_id; // Use 'tvdb_id' to fetch series info
            const seriesInfo = await getSeriesInfo(token, seriesId);

            if (seriesInfo.data && seriesInfo.data.image) {
                const thumbnailUrl = seriesInfo.data.image;
                console.log(`Series Name: ${firstResult.name}`);
                await displayThumbnail(thumbnailUrl);
            } else {
                console.log('Series image not found.');
            }
        } else {
            console.log('Series not found.');
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
}

main();