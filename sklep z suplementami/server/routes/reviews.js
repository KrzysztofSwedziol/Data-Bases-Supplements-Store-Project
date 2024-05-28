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
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    const review = await db.collection('Reviews').findOne({ _id: id });

    if (review) {
      res.status(200).send(review);
    } else {
      res.status(404).send({ message: 'Review not found' });
    }
  } catch (err) {
    console.error('Error retrieving review:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const newReview = req.body;

    if (!newReview || Object.keys(newReview).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Reviews').insertOne(newReview);
    res.status(201).send({ message: 'Review created successfully', reviewId: result.insertedId });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);
    const updatedReview = req.body;

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    if (!updatedReview || Object.keys(updatedReview).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Reviews').replaceOne(
      { _id: id },
      updatedReview
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Review replaced successfully' });
    } else {
      res.status(404).send({ message: 'Review not found' });
    }
  } catch (err) {
    console.error('Error replacing review:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);
    const updateFields = req.body;

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    if (!updateFields || Object.keys(updateFields).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Reviews').updateOne(
      { _id: id },
      { $set: updateFields }
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Review updated successfully' });
    } else {
      res.status(404).send({ message: 'Review not found' });
    }
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    const result = await db.collection('Reviews').deleteOne(
      { _id: id }
    );

    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Review deleted successfully' });
    } else {
      res.status(404).send({ message: 'Review not found' });
    }
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

export default router;
