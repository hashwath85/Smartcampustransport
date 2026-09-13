import { Request, Response } from 'express';
import { validateAndRecordAttendance } from '../services/attendance.service.js';

export const validateQR = async (req: Request, res: Response) => {
  try {
    const { qrPayload, driverGps } = req.body;
    const driverId = req.user?.driverId || req.user?.uid;

    if (!qrPayload || !driverGps || !driverGps.latitude || !driverGps.longitude) {
      return res.status(400).json({
        success: false,
        errorCode: 'ERR_INVALID_INPUT',
        message: 'Missing required parameters: qrPayload and driverGps coordinates.'
      });
    }

    if (!driverId) {
      return res.status(403).json({
        success: false,
        errorCode: 'ERR_UNAUTHORIZED_DRIVER',
        message: 'Driver identity could not be verified from token.'
      });
    }

    const result = await validateAndRecordAttendance({
      qrPayload,
      driverGps,
      driverId
    });

    return res.status(200).json({
      success: true,
      message: 'Boarding Approved',
      data: result
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      errorCode: error.errorCode || 'ERR_INTERNAL_SERVER',
      message: error.message || 'An unexpected error occurred during QR verification.'
    });
  }
};
