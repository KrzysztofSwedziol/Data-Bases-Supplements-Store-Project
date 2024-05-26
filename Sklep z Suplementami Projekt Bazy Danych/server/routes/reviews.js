import express from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await connectToDatabase();
  const reviews = await db.collection('Reviews').find({}).toArray();
  res.json(reviews);
});

router.get('/:id', async (req, res) => {
  const db = await connectToDatabase();
  const review = await db.collection('Reviews').findOne({ _id: ObjectId(req.params.id) });
  res.json(review);
});

router.post('/', async (req, res) => {
  const db = await connectToDatabase();
  const newReview = {
    _id: req.body._id,
    rating: req.body.rating,
    comment: req.body.comment,
    date: new Date(req.body.date),
    product_id: req.body.product_id,
    user_id: req.body.user_id,
  };
  try {
    const result = await db.collection('Reviews').insertOne(newReview);
    res.status(201).send({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  const db = await connectToDatabase();
  try {
    const result = await db.collection('Reviews').deleteOne({ _id: ObjectId(req.params.id) });
    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Review deleted successfully' });
    } else {
      res.status(404).send({ message: 'Review not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
