const express = require('express');
const axios = require('axios');

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
  if (!ENDPOINT_API_KEY || clientKey !== ENDPOINT_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await axios.post(VERTEX_AI_API_URL, req.body, {
      headers: {
        'Authorization': `Bearer ${VERTEX_AI_API_KEY}`,
        'content-type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Claude API wrapper listening on port ${port}`);
});
