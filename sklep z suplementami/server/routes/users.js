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
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    const user = await db.collection('Users').findOne({ _id: id });

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error retrieving user:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.get('/:id/orders', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    const orders = await db.collection('Orders').find({ user_id: userId }).toArray();
    if (orders.length === 0) {
      return res.status(404).send({ message: 'No orders found for this user' });
    }

    const productIds = orders.flatMap(order => order.items.map(item => item[0]));
    const products = await db.collection('Products').find({ _id: { $in: productIds } }).toArray();

    const detailedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => {
        const product = products.find(p => p._id === item[0]);
        return {
          product,
          quantity: item[1]
        };
      })
    }));

    res.status(200).send(detailedOrders);
  } catch (err) {
    console.error('Error retrieving orders:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});



router.post('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const newUser = req.body;

    if (!newUser || Object.keys(newUser).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Users').insertOne(newUser);
    res.status(201).send({ message: 'User created successfully', userId: result.insertedId });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);
    const updatedUser = req.body;

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    if (!updatedUser || Object.keys(updatedUser).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Users').replaceOne(
      { _id: id },
      updatedUser
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'User replaced successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error replacing user:', err);
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

    const result = await db.collection('Users').updateOne(
      { _id: id },
      { $set: updateFields }
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'User updated successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating user:', err);
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

    const result = await db.collection('Users').deleteOne(
      { _id: id }
    );

    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'User deleted successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

export default router;
