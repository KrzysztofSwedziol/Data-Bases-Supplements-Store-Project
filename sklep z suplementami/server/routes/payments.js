import express from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await connectToDatabase();
  const payments = await db.collection('Payments').find({}).toArray();
  res.json(payments);
});

router.get('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    const payment = await db.collection('Payments').findOne({ _id: id });

    if (payment) {
      res.status(200).send(payment);
    } else {
      res.status(404).send({ message: 'Payment not found' });
    }
  } catch (err) {
    console.error('Error retrieving payment:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const newPayment = req.body;

    if (!newPayment || Object.keys(newPayment).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    if (newPayment.date && newPayment.date.$date) {
      newPayment.date = new Date(newPayment.date.$date);
    } else if (typeof newPayment.date === 'string') {
      newPayment.date = new Date(newPayment.date);
    } else {
      return res.status(400).send({ message: 'Invalid date format' });
    }

    const result = await db.collection('Payments').insertOne(newPayment);

    if (newPayment.completed) {
      const orderId = parseInt(newPayment.order_id, 10);

      if (isNaN(orderId)) {
        return res.status(400).send({ message: 'Invalid order ID format' });
      }

      const order = await db.collection('Orders').findOne({ _id: orderId });

      if (order) {
        // Check product stock availability
        const productIds = order.items.map(item => item[0]);
        const products = await db.collection('Products').find({ _id: { $in: productIds } }).toArray();

        const insufficientStock = products.filter(product => {
          const orderedQuantity = order.items.find(item => item[0] === product._id)[1];
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

        // Reduce the stock for the ordered products
        for (const item of order.items) {
          const productId = item[0];
          const quantity = item[1];
          await db.collection('Products').updateOne(
            { _id: productId },
            { $inc: { stock: -quantity } }
          );
        }

        res.status(201).send({ message: 'Payment created and stock updated successfully', paymentId: result.insertedId });
      } else {
        res.status(404).send({ message: 'Order not found' });
      }
    } else {
      res.status(201).send({ message: 'Payment created successfully', paymentId: result.insertedId });
    }
  } catch (err) {
    console.error('Error creating payment:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);
    const updatedPayment = req.body;

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    if (!updatedPayment || Object.keys(updatedPayment).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Payments').replaceOne(
      { _id: id },
      updatedPayment
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Payment replaced successfully' });
    } else {
      res.status(404).send({ message: 'Payment not found' });
    }
  } catch (err) {
    console.error('Error replacing payment:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);
    const updateFields = req.body;

    // Check if the ID is a valid integer
    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    if (!updateFields || Object.keys(updateFields).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }
    const result = await db.collection('Payments').updateOne(
      { _id: id },
      { $set: updateFields }
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Payment updated successfully' });
    } else {
      res.status(404).send({ message: 'Payment not found' });
    }
  } catch (err) {
    console.error('Error updating payment:', err);
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

    const result = await db.collection('Payments').deleteOne(
      { _id: id }
    );

    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Payment deleted successfully' });
    } else {
      res.status(404).send({ message: 'Payment not found' });
    }
  } catch (err) {
    console.error('Error deleting payment:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

export default router;
