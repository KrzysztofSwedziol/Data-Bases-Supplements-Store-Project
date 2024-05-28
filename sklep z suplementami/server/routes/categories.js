import express from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await connectToDatabase();
  const categories = await db.collection('Categories').find({}).toArray();
  res.json(categories);
});

router.get('/:id', async (req, res) => {
  const db = await connectToDatabase();
  let query = {};
  try {
    const id = req.params.id;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { _id: parseInt(id, 10) };
    }
    const category = await db.collection('Categories').findOne(query);
    if (category) {
      res.json(category);
    } else {
      res.status(404).send({ message: 'Category not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/', async (req, res) => {
  const db = await connectToDatabase();
  const newCategory = {
    _id: req.body._id,
    name: req.body.name,
    description: req.body.description,
  };
  try {
    const result = await db.collection('Categories').insertOne(newCategory);
    res.status(201).send({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Categories').replaceOne(
      { _id: id }, 
      req.body
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Category replaced successfully' });
    } else {
      res.status(404).send({ message: 'Category not found' });
    }
  } catch (err) {
    console.error('Error replacing category:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});


router.patch('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    const result = await db.collection('Categories').updateOne(
      { _id: id }, 
      { $set: req.body }
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Category updated successfully' });
    } else {
      res.status(404).send({ message: 'Category not found' });
    }
  } catch (err) {
    console.error('Error updating category:', err);
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

    const result = await db.collection('Categories').deleteOne(
      { _id: id }
    );

    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Category deleted successfully' });
    } else {
      res.status(404).send({ message: 'Category not found' });
    }
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});


export default router;
