const { createMollieClient } = require('@mollie/api-client')


const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

async function createPayment(amount, description, redirectUrl) {
  const payment = await mollie.payments.create({
    amount: { currency: 'EUR', value: amount },
    description,
    redirectUrl,
  });

  return payment;
}

async function getPaymentStatus(paymentId) {
  const payment = await mollie.payments.get(paymentId);
  return payment.status;
}

module.exports = { createPayment, getPaymentStatus };
