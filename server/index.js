const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/quiz', async (req, res) => {
  const { topic } = req.body;
  console.log("Topic received from frontend:", topic);

  const prompt = `Generate 10 multiple choice questions on "${topic}". Each question should have 4 options and one correct answer. Format the response as JSON like: [{"question":"...","options":["A","B","C","D"],"answer":"B"}]`;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const raw = response.data.choices[0].message.content;
    console.log("Raw OpenAI Response:", raw);

    const questions = JSON.parse(raw);
    res.json({ questions });

  } catch (err) {
    console.error(" OpenAI Error:", err.response?.data || err.message);
    res.status(500).send({
      error: "OpenAI request failed",
      details: err.response?.data || err.message,
    });
  }
});


app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));
