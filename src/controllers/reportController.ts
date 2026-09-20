import type { Request, Response } from 'express';
import {
  getExecutiveOverviewReport,
  getFleetPerformanceReport,
  getStudentAttendanceReport,
  getBreakdownAnalyticsReport,
  getComplaintsAnalyticsReport
} from '../services/reportService.js';

export const getOverviewReport = async (_req: Request, res: Response) => {
  try {
    const report = await getExecutiveOverviewReport();
    return res.status(200).json({
      success: true,
      message: 'Executive overview report generated successfully',
      data: report
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getFleetPerformance = async (req: Request, res: Response) => {
  try {
    const report = await getFleetPerformanceReport(req.query as Record<string, any>);
    return res.status(200).json({
      success: true,
      message: 'Fleet performance report generated successfully',
      data: report
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getStudentAttendance = async (req: Request, res: Response) => {
  try {
    const report = await getStudentAttendanceReport(req.query as Record<string, any>);
    return res.status(200).json({
      success: true,
      message: 'Student attendance report generated successfully',
      data: report
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getBreakdownAnalytics = async (req: Request, res: Response) => {
  try {
    const report = await getBreakdownAnalyticsReport(req.query as Record<string, any>);
    return res.status(200).json({
      success: true,
      message: 'Breakdown analytics report generated successfully',
      data: report
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getComplaintsAnalytics = async (req: Request, res: Response) => {
  try {
    const report = await getComplaintsAnalyticsReport(req.query as Record<string, any>);
    return res.status(200).json({
      success: true,
      message: 'Complaints analytics report generated successfully',
      data: report
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
