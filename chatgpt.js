const axios = require('axios');

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';

async function sendMessageToChatGPT(message) {
  const response = await axios.post(
    CHATGPT_API_URL,
    {
      model: 'text-davinci-003', // Replace with the desired model
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: message }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.CHATGPT_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
}

module.exports = { sendMessageToChatGPT };
