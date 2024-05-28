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
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    const supplier = await db.collection('Suppliers').findOne({ _id: id });

    if (supplier) {
      res.status(200).send(supplier);
    } else {
      res.status(404).send({ message: 'Supplier not found' });
    }
  } catch (err) {
    console.error('Error retrieving supplier:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const newSupplier = req.body;

    if (!newSupplier || Object.keys(newSupplier).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Suppliers').insertOne(newSupplier);
    res.status(201).send({ message: 'Supplier created successfully', supplierId: result.insertedId });
  } catch (err) {
    console.error('Error creating supplier:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);
    const updatedSupplier = req.body;

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    if (!updatedSupplier || Object.keys(updatedSupplier).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Suppliers').replaceOne(
      { _id: id },
      updatedSupplier
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Supplier replaced successfully' });
    } else {
      res.status(404).send({ message: 'Supplier not found' });
    }
  } catch (err) {
    console.error('Error replacing supplier:', err);
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

    const result = await db.collection('Suppliers').updateOne(
      { _id: id },
      { $set: updateFields }
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Supplier updated successfully' });
    } else {
      res.status(404).send({ message: 'Supplier not found' });
    }
  } catch (err) {
    console.error('Error updating supplier:', err);
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

    const result = await db.collection('Suppliers').deleteOne(
      { _id: id }
    );

    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Supplier deleted successfully' });
    } else {
      res.status(404).send({ message: 'Supplier not found' });
    }
  } catch (err) {
    console.error('Error deleting supplier:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

export default router;
