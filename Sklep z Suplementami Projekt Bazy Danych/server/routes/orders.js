import express from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await connectToDatabase();
  const orders = await db.collection('Orders').find({}).toArray();
  res.json(orders);
});

router.get('/:id', async (req, res) => {
  const db = await connectToDatabase();
  const order = await db.collection('Orders').findOne({ _id: ObjectId(req.params.id) });
  res.json(order);
});

router.post('/', async (req, res) => {
  const db = await connectToDatabase();
  try {
    const result = await db.collection('Orders').insertOne(req.body);
    res.status(201).send({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/:id', async (req, res) => {
  const db = await connectToDatabase();
  try {
    const result = await db.collection('Orders').replaceOne({ _id: ObjectId(req.params.id) }, req.body);
    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Order replaced successfully' });
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch('/:id', async (req, res) => {
  const db = await connectToDatabase();
  try {
    const result = await db.collection('Orders').updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body });
    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Order updated successfully' });
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  const db = await connectToDatabase();
  try {
    const result = await db.collection('Orders').deleteOne({ _id: ObjectId(req.params.id) });
    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Order deleted successfully' });
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
