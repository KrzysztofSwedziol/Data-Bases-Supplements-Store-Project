Krzysztof Swędzioł, Piotr Błaszczyk - Dokumentacja Projektu Sklep z Suplementami

1. Struktura Projektu
1.1 W celu zwiększenia czytelności, handlery do poszczególnych requestów, odpowiadających za poszczególne kolekcje umieściliśmy w osobnych routach : 

![alt text](<Projekt Screeny do dokumentacji/routes.png>)

1.2 W celu bezpieczeństwa, aby uchronić się przed wykradnięciem danych w postaci na przykład haseł, stworzyliśmy dodatkowy plik 
.env, w którym przechowujemy takowe informacje, który natomiast dodaliśmy do .gitignore

![alt text](<Projekt Screeny do dokumentacji/env.png>)

1.3 Żeby ułatwić sobie łączenie z bazą, stworzyliśmy jeden plik js, który obsługuje właśnie to zadanie w funkcji, którą eksportuje. Oznacza to że w pozostałych plikach nie musimy robić tego ręcznie, a jedynie zaimportować i użyć opisywaną funkcję.

![alt text](<Projekt Screeny do dokumentacji/Connect To Database.png>)

1.4 Główna część servera umieszczona jest w pliku app.js, który nasłuchuje nadchodzące requesty i przekierowuje je pod odpowiednie routy. 
![alt text](<Projekt Screeny do dokumentacji/app js.png>)

Całość prezentuje się następująco : 
![alt text](<Projekt Screeny do dokumentacji/Struktura Projektu.png>)

2. Struktura Bazy Danych 

Nasza Baza Danych składa się z 8 kolekcji, jest stworzona w technologii MongoDB, a jej schemat prezentuje się następująco : 

![alt text](<Projekt Screeny do dokumentacji/Baza Danych.png>)

Jej poszczególne kolekcje wyglądają w następujący sposób : 
2.1 Categories : 

![alt text](<Projekt Screeny do dokumentacji/Categories.png>)

2.2 Orders : 
![alt text](<Projekt Screeny do dokumentacji/Orders.png>)

2.3 Payments : 
![alt text](<Projekt Screeny do dokumentacji/Payments.png>)

2.4 Products : 
![alt text](<Projekt Screeny do dokumentacji/Products.png>)

2.5 Reviews : 
![alt text](<Projekt Screeny do dokumentacji/Reviews.png>)

2.6 Shipping : 
![alt text](<Projekt Screeny do dokumentacji/Shipping.png>)

2.7 Suppliers : 
![alt text](<Projekt Screeny do dokumentacji/Suppliers.png>)

2.8 Users : 
![alt text](<Projekt Screeny do dokumentacji/Users.png>)

3. Opis każdego Routa : 

Każdy Route odpowiedzialny jest za konkretne request. Jedno mają wspólne - każdy ma handler do : Otwarcia (GET), zapisu (POST), 
zastąpienia (PUT), edycji (PATCH) i usunięcia (DELETE) elementów z kolekcji za którą odpowiada.

3.1 Categories - jest relatywnie stałą kolekcją i zmiany w innych nie mają na nią wpływu, dlatego implementuje ona podstawowe operacje CRUD.

```javascript
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
  let query = {};
  try {
    const id = req.params.id;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { _id: parseInt(id, 10) };
    }
    const category = await db.collection('Categories').findOne(query);
    if (category) {
      res.json(category);
    } else {
      res.status(404).send({ message: 'Category not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
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
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Categories').replaceOne(
      { _id: id }, 
      req.body
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Category replaced successfully' });
    } else {
      res.status(404).send({ message: 'Category not found' });
    }
  } catch (err) {
    console.error('Error replacing category:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    const result = await db.collection('Categories').updateOne(
      { _id: id }, 
      { $set: req.body }
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Category updated successfully' });
    } else {
      res.status(404).send({ message: 'Category not found' });
    }
  } catch (err) {
    console.error('Error updating category:', err);
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

    const result = await db.collection('Categories').deleteOne(
      { _id: id }
    );

    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Category deleted successfully' });
    } else {
      res.status(404).send({ message: 'Category not found' });
    }
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});



export default router;



3.2 login - Oprócz podstawowych operacji, implementuje również ciekawą funkcjonalność - każde nowo zarejestrowane hasło "Haszuje"
i zapisuje do bazy danych w tej właśnie postaci. Uniemożliwia to kradzież haseł nawet w przypadku wypłynięcia danych z Bazy. Użytkownik przy logowaniu podaje hasło, następnie tworzony jest request i w serverze to hasło jest haszowane i porównywane z tym zapisanym w bazie danych. Dodatkowo sprawdzane jest czy logująca się osoba to Admin, czy Klient i w zależności od tego udostępniane są poszczególne funkcjonalności. 


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



3.3 Orders - Podstawowe operacje CRUD oraz sprawdzanie czy przy składaniu zamówienia, produkty w nie wchodzące są w magazynie, jeśli nie, informuje użytkownika, którego produktu brakuje. Jeśli zamówienie jest możliwe do zrealizowania, tworzony jest nowy Payment z id obeznego zamówienia.


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


    const orderResult = await db.collection('Orders').insertOne(newOrder);
    const orderId = orderResult.insertedId;


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

3.4 Payments - Oprócz podstawowych operacji, payment przy realizacji sprawdza za jakie zamówienie odpowiada i jeśli zostało ono opłacone to zmniejsza ilość produktów w magazynie o ilość podaną w zamówieniu. Jeśli użytkownik złożył zamówienie gdy produkty były dostępne, ale nie opłacił na czas i ktoś inny wykupił dany produkt, przy tworzeniu płatności klient zostanie poinformowany o braku produktów na magazynie.

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

3.5 Products - Podstawowe operacje CRUD, zmiany w kolekcji nie wpływają na inne kolekcje: 

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
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    const product = await db.collection('Products').findOne({ _id: id });

    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error retrieving product:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const newProduct = req.body;

    if (!newProduct || Object.keys(newProduct).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Products').insertOne(newProduct);
    res.status(201).send({ message: 'Product created successfully', productId: result.insertedId });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);
    const updatedProduct = req.body;

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    if (!updatedProduct || Object.keys(updatedProduct).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Products').replaceOne(
      { _id: id },
      updatedProduct
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Product replaced successfully' });
    } else {
      res.status(404).send({ message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error replacing product:', err);
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

    const result = await db.collection('Products').updateOne(
      { _id: id },
      { $set: updateFields }
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Product updated successfully' });
    } else {
      res.status(404).send({ message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error updating product:', err);
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

    const result = await db.collection('Products').deleteOne(
      { _id: id }
    );

    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Product deleted successfully' });
    } else {
      res.status(404).send({ message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});
export default router;

3.6 Reviews - Podstawowe operacje CRUD, zmiany w kolekcji nie wpływają na inne kolekcje : 

import express from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await connectToDatabase();
  const reviews = await db.collection('Reviews').find({}).toArray();
  res.json(reviews);
});

router.get('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    const review = await db.collection('Reviews').findOne({ _id: id });

    if (review) {
      res.status(200).send(review);
    } else {
      res.status(404).send({ message: 'Review not found' });
    }
  } catch (err) {
    console.error('Error retrieving review:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const newReview = req.body;

    if (!newReview || Object.keys(newReview).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Reviews').insertOne(newReview);
    res.status(201).send({ message: 'Review created successfully', reviewId: result.insertedId });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);
    const updatedReview = req.body;

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    if (!updatedReview || Object.keys(updatedReview).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Reviews').replaceOne(
      { _id: id },
      updatedReview
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Review replaced successfully' });
    } else {
      res.status(404).send({ message: 'Review not found' });
    }
  } catch (err) {
    console.error('Error replacing review:', err);
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

    const result = await db.collection('Reviews').updateOne(
      { _id: id },
      { $set: updateFields }
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Review updated successfully' });
    } else {
      res.status(404).send({ message: 'Review not found' });
    }
  } catch (err) {
    console.error('Error updating review:', err);
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

    const result = await db.collection('Reviews').deleteOne(
      { _id: id }
    );

    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Review deleted successfully' });
    } else {
      res.status(404).send({ message: 'Review not found' });
    }
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

export default router;


3.7 Shipping - podstawowe operacje CRUD, zmiany w kolekcji nie wpływają na inne kolekcje. Sposób dostawy jest wynierany przez użytkownika podczas tworzenia płatności i jest traktowany odrębnie.

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
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    const shipping = await db.collection('Shipping').findOne({ _id: id });

    if (shipping) {
      res.status(200).send(shipping);
    } else {
      res.status(404).send({ message: 'Shipping not found' });
    }
  } catch (err) {
    console.error('Error retrieving shipping:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const newShipping = req.body;

    if (!newShipping || Object.keys(newShipping).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Shipping').insertOne(newShipping);
    res.status(201).send({ message: 'Shipping created successfully', shippingId: result.insertedId });
  } catch (err) {
    console.error('Error creating shipping:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const id = parseInt(req.params.id, 10);
    const updatedShipping = req.body;

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    if (!updatedShipping || Object.keys(updatedShipping).length === 0) {
      return res.status(400).send({ message: 'Request body cannot be empty' });
    }

    const result = await db.collection('Shipping').replaceOne(
      { _id: id },
      updatedShipping
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Shipping replaced successfully' });
    } else {
      res.status(404).send({ message: 'Shipping not found' });
    }
  } catch (err) {
    console.error('Error replacing shipping:', err);
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

    const result = await db.collection('Shipping').updateOne(
      { _id: id },
      { $set: updateFields }
    );

    if (result.matchedCount === 1) {
      res.status(200).send({ message: 'Shipping updated successfully' });
    } else {
      res.status(404).send({ message: 'Shipping not found' });
    }
  } catch (err) {
    console.error('Error updating shipping:', err);
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

    const result = await db.collection('Shipping').deleteOne(
      { _id: id }
    );

    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Shipping deleted successfully' });
    } else {
      res.status(404).send({ message: 'Shipping not found' });
    }
  } catch (err) {
    console.error('Error deleting shipping:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

export default router;

3.8 Users - operacje zgodne z tabelą login. Użytkowników można wypisać lub zarejestrować. 

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




