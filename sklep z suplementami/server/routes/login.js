import express from 'express';
import crypto from 'crypto';
import { connectToDatabase } from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).send({ message: 'Username and password are required' });
    }

    const user = await db.collection('Users').findOne({ username: username });

    if (user) {
      const hash = crypto.createHash('sha256').update(password).digest('base64');

      if (hash === user.passwordHash) {
        if (username === 'Kanye_East') {
          res.status(200).send({ message: 'Login successful', welcome: 'Welcome admin' });
        } else {
          res.status(200).send({ message: 'Login successful', welcome: 'Welcome customer' });
        }
      } else {
        res.status(401).send({ message: 'Incorrect password' });
      }
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

export default router;
