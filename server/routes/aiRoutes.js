const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.post('/summarize', async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ success: false, message: 'Description is required' });
  }
  try {
    const groqRes = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant', // or another model Groq supports
        messages: [
          { role: 'system', content: 'You are a helpful assistant that summarizes notes.' },
          { role: 'user', content: `Summarize this note in 2-3 sentences:\n\n${description}` }
        ],
        max_tokens: 120,
        temperature: 0.5,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    const summary = groqRes.data.choices[0].message.content.trim();
    res.json({ success: true, summary });
  } catch (err) {
     console.error("Groq Error Response:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'AI summarization failed', error: err.message });
  }
});

router.post('/chat', async (req, res) => {
  const { description, question, history = [] } = req.body;
  if (!description || !question) {
    return res.status(400).json({ success: false, message: 'Description and question are required' });
  }
  try {
    // Build the chat history for the AI
    const messages = [
      { role: 'system', content: 'You are a helpful assistant. Use the following note as context for all answers.' },
      { role: 'user', content: `Note: ${description}` },
      ...history, // previous {role, content} pairs
      { role: 'user', content: question }
    ];
    const groqRes = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages,
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    const answer = groqRes.data.choices[0].message.content.trim();
    res.json({ success: true, answer });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI chat failed', error: err.message });
  }
});

module.exports = router;