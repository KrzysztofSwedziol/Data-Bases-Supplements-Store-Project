import express from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await connectToDatabase();
  const payments = await db.collection('Payments').find({}).toArray();
  res.json(payments);
});

router.get('/:id', async (req, res) => {
  const db = await connectToDatabase();
  const payment = await db.collection('Payments').findOne({ _id: ObjectId(req.params.id) });
  res.json(payment);
});

router.post('/', async (req, res) => {
  const db = await connectToDatabase();
  const newPayment = {
    _id: req.body._id,
    amount: req.body.amount,
    paymentMethod: req.body.paymentMethod,
    date: new Date(req.body.date),
    completed: req.body.completed,
    order_id: req.body.order_id,
  };
  try {
    const result = await db.collection('Payments').insertOne(newPayment);
    res.status(201).send({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  const db = await connectToDatabase();
  try {
    const result = await db.collection('Payments').deleteOne({ _id: ObjectId(req.params.id) });
    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Payment deleted successfully' });
    } else {
      res.status(404).send({ message: 'Payment not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
