import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv'; // Asegúrate de importar dotenv
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configurar dotenv para acceder a las variables de entorno
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_LEY || '', { apiVersion: '2024-09-30.acacia' });
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Cambiado a tu frontend
  credentials: true,
}));
app.use(bodyParser.json());

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: 'Error creating payment intent' });
  }
});

app.listen(5000, () => {
  console.log('Servidor escuchando en http://localhost:5000');
});
