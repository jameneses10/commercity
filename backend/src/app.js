const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/env');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const storeRoutes = require('./routes/store.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const addressRoutes = require('./routes/address.routes');
const { orderRouter, sellerOrderRouter, adminOrderRouter } = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const accountRoutes = require('./routes/account.routes');
const profileRoutes = require('./routes/profile.routes');
const { shipmentRouter, sellerShipmentRouter } = require('./routes/shipment.routes');
const { reviewRouter, adminReviewRouter } = require('./routes/review.routes');
const notificationRoutes = require('./routes/notification.routes');
const logRoutes = require('./routes/log.routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/stores', storeRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/seller', sellerOrderRouter);
app.use('/api/v1/admin', adminOrderRouter);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/account', accountRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/shipments', shipmentRouter);
app.use('/api/v1/seller', sellerShipmentRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/admin/reviews', adminReviewRouter);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin/logs', logRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
