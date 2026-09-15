const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Root Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ACTIVE',
    system: 'Smart Campus Transport Intelligence API Core',
    version: '3.0.0'
  });
});

// Bind BE2 Workstream Routes
app.use('/api/v1/gps', require('./routes/gpsRoutes'));
app.use('/api/v1/trips', require('./routes/tripRoutes'));
app.use('/api/v1/wait-request', require('./routes/waitRequestRoutes'));

// Bind BE3 Workstream Routes
app.use('/api/v1/complaints', require('./routes/complaintRoutes'));
app.use('/api/v1/breakdowns', require('./routes/breakdownRoutes'));
app.use('/api/v1/audit-logs', require('./routes/auditLogRoutes'));
app.use('/api/v1/reports', require('./routes/reportRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server active on port ' + PORT);
});
