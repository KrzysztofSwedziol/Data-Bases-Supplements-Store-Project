import express from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await connectToDatabase();
  const suppliers = await db.collection('Suppliers').find({}).toArray();
  res.json(suppliers);
});

router.get('/:id', async (req, res) => {
  const db = await connectToDatabase();
  const supplier = await db.collection('Suppliers').findOne({ _id: ObjectId(req.params.id) });
  res.json(supplier);
});

router.post('/', async (req, res) => {
  const db = await connectToDatabase();
  const newSupplier = {
    _id: req.body._id,
    name: req.body.name,
    address: {
      street: req.body.address.street,
      city: req.body.address.city,
      zip: req.body.address.zip,
      country: req.body.address.country,
    },
  };
  try {
    const result = await db.collection('Suppliers').insertOne(newSupplier);
    res.status(201).send({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  const db = await connectToDatabase();
  try {
    const result = await db.collection('Suppliers').deleteOne({ _id: ObjectId(req.params.id) });
    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Supplier deleted successfully' });
    } else {
      res.status(404).send({ message: 'Supplier not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
