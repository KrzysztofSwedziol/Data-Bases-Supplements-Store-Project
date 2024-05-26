import express from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await connectToDatabase();
  const users = await db.collection('Users').find({}).toArray();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const db = await connectToDatabase();
  const user = await db.collection('Users').findOne({ _id: ObjectId(req.params.id) });
  res.json(user);
});

router.post('/', async (req, res) => {
  const db = await connectToDatabase();
  const result = await db.collection('Users').insertOne(req.body);
  res.status(201).send(result.insertedId);
});

export default router;
