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
  const category = await db.collection('Categories').findOne({ _id: ObjectId(req.params.id) });
  res.json(category);
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
  const db = await connectToDatabase();
  const updatedCategory = {
    _id: req.body._id,
    name: req.body.name,
    description: req.body.description,
  };
  try {
    const result = await db.collection('Categories').replaceOne({ _id: ObjectId(req.params.id) }, updatedCategory);
    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Category replaced successfully' });
    } else {
      res.status(404).send({ message: 'Category not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch('/:id', async (req, res) => {
  const db = await connectToDatabase();
  try {
    const result = await db.collection('Categories').updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body });
    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Category updated successfully' });
    } else {
      res.status(404).send({ message: 'Category not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  const db = await connectToDatabase();
  try {
    const result = await db.collection('Categories').deleteOne({ _id: ObjectId(req.params.id) });
    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Category deleted successfully' });
    } else {
      res.status(404).send({ message: 'Category not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
