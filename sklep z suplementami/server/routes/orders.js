import express from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await connectToDatabase();
  const orders = await db.collection('Orders').find({}).toArray();
  res.json(orders);
});

router.get('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    const order = await db.collection('Orders').findOne({ _id: id });

    if (order) {
      res.status(200).send(order);
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  } catch (err) {
    console.error('Error retrieving order:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const newOrder = req.body;

    if (!newOrder || Object.keys(newOrder).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    // Check product stock availability
    const productIds = newOrder.items.map(item => item[0]);
    const products = await db.collection('Products').find({ _id: { $in: productIds } }).toArray();

    const insufficientStock = products.filter(product => {
      const orderedQuantity = newOrder.items.find(item => item[0] === product._id)[1];
      return product.stock < orderedQuantity;
    });

    if (insufficientStock.length > 0) {
      const insufficientStockDetails = insufficientStock.map(product => ({
        productId: product._id,
        productName: product.name,
        availableStock: product.stock
      }));
      return res.status(400).send({ message: 'Insufficient stock for some products', insufficientStockDetails });
    }

    // Insert the new order
    const orderResult = await db.collection('Orders').insertOne(newOrder);
    const orderId = orderResult.insertedId;

    // Create a new payment with status false
    const newPayment = {
      paymentMethod: "credit_card", // or extract from order if needed
      date: new Date(),
      completed: false,
      order_id: orderId,
      user_id: newOrder.user_id // Assuming this is available in the order
    };

    const paymentResult = await db.collection('Payments').insertOne(newPayment);

    res.status(201).send({ 
      message: 'Order and payment created successfully', 
      orderId: orderId,
      paymentId: paymentResult.insertedId
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);
    const updatedOrder = req.body;

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    if (!updatedOrder || Object.keys(updatedOrder).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Orders').replaceOne(
      { _id: id },
      updatedOrder
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Order replaced successfully' });
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  } catch (err) {
    console.error('Error replacing order:', err);
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

    const result = await db.collection('Orders').updateOne(
      { _id: id },
      { $set: updateFields }
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Order updated successfully' });
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  } catch (err) {
    console.error('Error updating order:', err);
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

    const result = await db.collection('Orders').deleteOne(
      { _id: id }
    );

    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Order deleted successfully' });
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});


export default router;
