// server/routes/shipping.js
import express from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await connectToDatabase();
  const shipments = await db.collection('Shipping').find({}).toArray();
  res.json(shipments);
});

router.get('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    const shipping = await db.collection('Shipping').findOne({ _id: id });

    if (shipping) {
      res.status(200).send(shipping);
    } else {
      res.status(404).send({ message: 'Shipping not found' });
    }
  } catch (err) {
    console.error('Error retrieving shipping:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const newShipping = req.body;

    if (!newShipping || Object.keys(newShipping).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Shipping').insertOne(newShipping);
    res.status(201).send({ message: 'Shipping created successfully', shippingId: result.insertedId });
  } catch (err) {
    console.error('Error creating shipping:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);
    const updatedShipping = req.body;

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    if (!updatedShipping || Object.keys(updatedShipping).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Shipping').replaceOne(
      { _id: id },
      updatedShipping
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Shipping replaced successfully' });
    } else {
      res.status(404).send({ message: 'Shipping not found' });
    }
  } catch (err) {
    console.error('Error replacing shipping:', err);
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

    const result = await db.collection('Shipping').updateOne(
      { _id: id },
      { $set: updateFields }
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Shipping updated successfully' });
    } else {
      res.status(404).send({ message: 'Shipping not found' });
    }
  } catch (err) {
    console.error('Error updating shipping:', err);
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

    const result = await db.collection('Shipping').deleteOne(
      { _id: id }
    );

    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Shipping deleted successfully' });
    } else {
      res.status(404).send({ message: 'Shipping not found' });
    }
  } catch (err) {
    console.error('Error deleting shipping:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

export default router;
