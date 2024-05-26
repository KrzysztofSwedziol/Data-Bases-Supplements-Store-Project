import express from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await connectToDatabase();
  const products = await db.collection('Products').find({}).toArray();
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const db = await connectToDatabase();
  const product = await db.collection('Products').findOne({ _id: ObjectId(req.params.id) });
  res.json(product);
});

router.post('/', async (req, res) => {
  const db = await connectToDatabase();
  const newProduct = {
    _id: req.body._id,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    attributes: req.body.attributes,
    category_id: req.body.category_id,
    supplier_id: req.body.supplier_id,
  };
  try {
    const result = await db.collection('Products').insertOne(newProduct);
    res.status(201).send({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  const db = await connectToDatabase();
  try {
    const result = await db.collection('Products').deleteOne({ _id: ObjectId(req.params.id) });
    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Product deleted successfully' });
    } else {
      res.status(404).send({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
export default router;
