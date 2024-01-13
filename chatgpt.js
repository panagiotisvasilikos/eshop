import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

async function sendMessageToChatGPT(message, email) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: message, email_address: email }],
    model: 'gpt-3.5-turbo',
  });
}


module.exports = { sendMessageToChatGPT };
