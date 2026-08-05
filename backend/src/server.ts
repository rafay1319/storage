import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env';
import { apiRateLimiter } from './middleware/rateLimiter';
import apiRoutes from './routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api', apiRateLimiter, apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'HEALTHY', timestamp: new Date().toISOString(), service: 'Storage Facility Backend SaaS' });
});

app.listen(ENV.PORT, () => {
  console.log(`🚀 Storage Facility Management System Backend running on port ${ENV.PORT}`);
});
