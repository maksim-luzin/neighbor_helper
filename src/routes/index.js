import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import distributorRoutes from './distributorRoutes';
import quantityRoutes from './quantityRoutes';

// register all routes
export default app => {
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/distributors', distributorRoutes);
  app.use('/api/quantities', quantityRoutes);
};
