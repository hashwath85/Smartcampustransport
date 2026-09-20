import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import gpsRoutes from './routes/gpsRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import waitRequestRoutes from './routes/waitRequestRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import breakdownRoutes from './routes/breakdownRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ACTIVE',
    system: 'Smart Campus Transport Intelligence API Core',
    version: '3.0.0'
  });
});

app.use('/api/v1/gps', gpsRoutes);
app.use('/api/v1/trips', tripRoutes);
app.use('/api/v1/wait-request', waitRequestRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/breakdowns', breakdownRoutes);
app.use('/api/v1/audit-logs', auditLogRoutes);
app.use('/api/v1/reports', reportRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Transport API Core Server Operational'
  });
});

app.listen(PORT, () => {
  console.log(`[BE2/BE3 Engine] Server running on port ${PORT}`);
});

export default app;
