import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import expressLayout from 'express-ejs-layouts';
import bodyParser from 'body-parser';
import mainRoutes from './server/routes/main.js';
import productsRouter from './server/routes/products.js';
import usersRouter from './server/routes/users.js';
import ordersRouter from './server/routes/orders.js';
import categoriesRouter from './server/routes/categories.js';
import paymentsRouter from './server/routes/payments.js';
import reviewsRouter from './server/routes/reviews.js';
import shippingRouter from './server/routes/shipping.js';
import suppliersRouter from './server/routes/categories.js';


const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use('/', mainRoutes);
app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);
app.use('/categories', categoriesRouter);
app.use('/payments', paymentsRouter);
app.use('/reviews', reviewsRouter);
app.use('/shipping', shippingRouter);
app.use('/suppliers', suppliersRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
