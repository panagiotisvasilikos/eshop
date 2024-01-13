const express = require('express');
const bodyParser = require('body-parser');
const { Client: Mailchimp } = require('@mailchimp/mailchimp_marketing');
const { createPayment, getPaymentStatus } = require('./mollie');
const { sendMessageToChatGPT } = require('./chatgpt');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Mailchimp
const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint for customer registration
app.post('/register', async (req, res) => {
  const { email, name } = req.body;


  try {
    // Subscribe to Mailchimp newsletter
    await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID, {
      email_address: email,
      status: 'subscribed',
      merge_fields: { FNAME: name },
    });

    // Additional customer registration logic can be added here

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for Mollie payment
app.post('/pay', async (req, res) => {
  const { amount, description, redirectUrl } = req.body;

  try {
    // Create payment with Mollie
    const paymentResponse = await createPayment(amount, description, redirectUrl);

    // Additional payment processing logic can be added here
    res.status(200).json({ paymentUrl: paymentResponse.links.paymentUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for checking Mollie payment status
app.get('/payment/status/:paymentId', async (req, res) => {
  const { paymentId } = req.params;

  try {
    // Get payment status from Mollie
    const status = await getPaymentStatus(paymentId);

    res.status(200).json({ status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for interacting with ChatGPT
app.post('/chat', async (req, res) => {
  const { email, message } = req.body;

  try {
    // Send message to ChatGPT
    const chatResponse = await sendMessageToChatGPT(message, email);

    res.status(200).json({ reply: chatResponse.data.choices[0].text.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
