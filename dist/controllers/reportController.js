import { getExecutiveOverviewReport, getFleetPerformanceReport, getStudentAttendanceReport, getBreakdownAnalyticsReport, getComplaintsAnalyticsReport } from '../services/reportService.js';
export const getOverviewReport = async (_req, res) => {
    try {
        const report = await getExecutiveOverviewReport();
        return res.status(200).json({
            success: true,
            message: 'Executive overview report generated successfully',
            data: report
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getFleetPerformance = async (req, res) => {
    try {
        const report = await getFleetPerformanceReport(req.query);
        return res.status(200).json({
            success: true,
            message: 'Fleet performance report generated successfully',
            data: report
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getStudentAttendance = async (req, res) => {
    try {
        const report = await getStudentAttendanceReport(req.query);
        return res.status(200).json({
            success: true,
            message: 'Student attendance report generated successfully',
            data: report
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getBreakdownAnalytics = async (req, res) => {
    try {
        const report = await getBreakdownAnalyticsReport(req.query);
        return res.status(200).json({
            success: true,
            message: 'Breakdown analytics report generated successfully',
            data: report
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getComplaintsAnalytics = async (req, res) => {
    try {
        const report = await getComplaintsAnalyticsReport(req.query);
        return res.status(200).json({
            success: true,
            message: 'Complaints analytics report generated successfully',
            data: report
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
