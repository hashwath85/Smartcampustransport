import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import attendanceRoutes from './routes/attendanceRoutes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
// Mount Backend Dev 1 Core Routes
app.use('/api/v1/attendance', attendanceRoutes);
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Transport API Core Server Operational' });
});
app.listen(PORT, () => {
    console.log(`[BE1 Engine] Server running on port ${PORT}`);
});
export default app;
