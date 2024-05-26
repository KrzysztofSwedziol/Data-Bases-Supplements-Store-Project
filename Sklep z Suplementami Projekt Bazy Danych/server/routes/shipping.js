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
  const db = await connectToDatabase();
  const shipment = await db.collection('Shipping').findOne({ _id: ObjectId(req.params.id) });
  res.json(shipment);
});

router.post('/', async (req, res) => {
  const db = await connectToDatabase();
  const newShipment = {
    _id: req.body._id,
    carrier: req.body.carrier,
    trackingNumber: req.body.trackingNumber,
    status: req.body.status,
    estimatedDeliveryDate: new Date(req.body.estimatedDeliveryDate),
    order_id: req.body.order_id,
  };
  try {
    const result = await db.collection('Shipping').insertOne(newShipment);
    res.status(201).send({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  const db = await connectToDatabase();
  try {
    const result = await db.collection('Shipping').deleteOne({ _id: ObjectId(req.params.id) });
    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Shipment deleted successfully' });
    } else {
      res.status(404).send({ message: 'Shipment not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
