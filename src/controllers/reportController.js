const reportService = require('../services/reportService');

// GET /api/v1/reports/overview
exports.getOverviewReport = async (req, res) => {
  try {
    const report = await reportService.getExecutiveOverviewReport();
    return res.status(200).json({
      success: true,
      message: 'Executive overview report generated successfully',
      data: report
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/v1/reports/fleet-performance
exports.getFleetPerformance = async (req, res) => {
  try {
    const report = await reportService.getFleetPerformanceReport(req.query);
    return res.status(200).json({
      success: true,
      message: 'Fleet performance report generated successfully',
      data: report
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/v1/reports/student-attendance
exports.getStudentAttendance = async (req, res) => {
  try {
    const report = await reportService.getStudentAttendanceReport(req.query);
    return res.status(200).json({
      success: true,
      message: 'Student attendance report generated successfully',
      data: report
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/v1/reports/breakdowns
exports.getBreakdownAnalytics = async (req, res) => {
  try {
    const report = await reportService.getBreakdownAnalyticsReport(req.query);
    return res.status(200).json({
      success: true,
      message: 'Breakdown analytics report generated successfully',
      data: report
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/v1/reports/complaints
exports.getComplaintsAnalytics = async (req, res) => {
  try {
    const report = await reportService.getComplaintsAnalyticsReport(req.query);
    return res.status(200).json({
      success: true,
      message: 'Complaints analytics report generated successfully',
      data: report
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
