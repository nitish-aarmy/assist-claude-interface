const express = require('express');
const axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*', // You can restrict this to your frontend URL for more security
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
}));
app.use(express.json());

// Set your Claude API endpoint and key here
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

// Simple API key check for incoming requests
const ENDPOINT_API_KEY = process.env.ENDPOINT_API_KEY;

// Vertex AI endpoint and key
const VERTEX_AI_API_URL = 'https://us-central1-aiplatform.googleapis.com/v1/projects/YOUR_PROJECT_ID/locations/us-central1/publishers/google/models/YOUR_MODEL:predict';
const VERTEX_AI_API_KEY = process.env.VERTEX_AI_API_KEY;

app.post('/claude', async (req, res) => {
  const clientKey = req.headers['x-api-key'];
  if (!ENDPOINT_API_KEY || clientKey !== ENDPOINT_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await axios.post(CLAUDE_API_URL, req.body, {
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'content-type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vertex AI proxy endpoint
app.post('/vertex', async (req, res) => {
  const clientKey = req.headers['x-api-key'];
  if (!ENDPOINT_API_KEY || ENDPOINT_API_KEY === '' || clientKey !== ENDPOINT_API_KEY) {
    console.warn('Skipping API key check for local testing');
  }

  try {
    const VERTEX_AI_API_URL = `https://${ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION_ID}/publishers/anthropic/models/${MODEL_ID}:${METHOD}`;
    const response = await axios.post(VERTEX_AI_API_URL, req.body, {
      headers: {
        'Authorization': `Bearer ${VERTEX_AI_API_KEY}`,
        'content-type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error in /vertex endpoint:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint configuration from .env
const ENDPOINT = process.env.ENDPOINT;
const LOCATION_ID = process.env.LOCATION_ID;
const PROJECT_ID = process.env.PROJECT_ID;
const MODEL_ID = process.env.MODEL_ID;
const METHOD = process.env.METHOD;

// Function to call Vertex AI API
async function callVertexAI() {
    const requestFilePath = path.join(__dirname, 'request.json');
    const requestBody = JSON.parse(fs.readFileSync(requestFilePath, 'utf-8'));

    const url = `https://${ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION_ID}/publishers/anthropic/models/${MODEL_ID}:${METHOD}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.ENDPOINT_API_KEY}`,
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Vertex AI Response:', data);
        console.log('Vertex AI API Response:', JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error('Error calling Vertex AI:', error);
        throw error;
    }
}

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Claude API wrapper listening on port ${port}`);
});

// Allow local testing without API key
if (process.env.ENDPOINT_API_KEY && req.headers['x-endpoint-api-key'] !== process.env.ENDPOINT_API_KEY) {
  console.warn('Skipping API key check for local testing');
}
